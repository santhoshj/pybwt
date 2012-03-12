from bwt import getBWTIndex
import sys
import pickle

def main(string, query):
    index = getBWTIndex(string)
    print index.bwt
    print index.search(query)
    f = open("/tmp/index1", 'w')
    pickle.dump(index, f)
    f.close()

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
