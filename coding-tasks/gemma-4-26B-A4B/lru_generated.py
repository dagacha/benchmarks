import threading

class Node:
    def __init__(self, key=None, value=None):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.lock = threading.Lock()
        
        # Sentinel nodes for doubly-linked list
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head
        
        self.hits = 0
        self.misses = 0

    def _remove(self, node):
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add_to_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        with self.lock:
            if key in self.cache:
                node = self.cache[key]
                self._remove(node)
                self._add_to_front(node)
                self.hits += 1
                return node.value
            else:
                self.misses += 1
                return -1

    def put(self, key, value):
        with self.lock:
            if key in self.cache:
                node = self.cache[key]
                node.value = value
                self._remove(node)
                self._add_to_front(node)
            else:
                if len(self.cache) >= self.capacity:
                    # Evict LRU (node before tail)
                    lru_node = self.tail.prev
                    if lru_node != self.head:
                        self._remove(lru_node)
                        del self.cache[lru_node.key]
                
                new_node = Node(key, value)
                self.cache[key] = new_node
                self._add_to_front(new_node)

    def get_stats(self):
        with self.lock:
            total = self.hits + self.misses
            hit_rate = (self.hits / total) if total > 0 else 0.0
            return {
                'hits': self.hits,
                'misses': self.misses,
                'hit_rate': hit_rate
            }