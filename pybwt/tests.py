import unittest

from bwt import getBWTIndex

class TestSearch(unittest.TestCase):
    
    def setUp(self):
        self.index = getBWTIndex("abracadabra")

    def test_search1(self):
        result = self.index.search("ab")
        self.assertEqual(result, set([0,7]))
    
    def test_search2(self):
        result = self.index.search("a")
        self.assertEqual(result, set([0,3,5,7,10]))
    
    def test_search3(self):
        result = self.index.search("cada")
        self.assertEqual(result, set([4]))

    def test_search4(self):
        result = self.index.search("cadaa")
        self.assertIsNone(result)
    
    def test_search5(self):
        result = self.index.search("s")
        self.assertIsNone(result)

    def test_search6(self):
        result = self.index.search("abracadabraa")
        self.assertIsNone(result)

if __name__ == '__main__':
    unittest.main()
