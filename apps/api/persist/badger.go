package persist

import (
	"strings"

	"github.com/dgraph-io/badger/v3"
)

type FileStorage struct {
	db *badger.DB
}

func NewFileStorage(badgerDbDir string) (*FileStorage, error) {
	f := new(FileStorage)
	db, err := badger.Open(badger.DefaultOptions(badgerDbDir))
	if err != nil {
		return nil, err
	}
	f.db = db

	return f, nil
}

func (f *FileStorage) Close() {
	f.db.Close()
}

func (f *FileStorage) SaveFile(owner string, name string, data []byte) error {
	err := f.db.Update(func(txn *badger.Txn) error {
		err := txn.Set([]byte(owner+"/"+name), data)
		return err
	})
	return err
}

func (f *FileStorage) GetFileNamesByOwner(owner string, take int, skip int) ([]string, error) {
	names := make([]string, take)
	skipped := 0
	took := 0
	err := f.db.View(func(txn *badger.Txn) error {
		it := txn.NewIterator(badger.DefaultIteratorOptions)
		defer it.Close()
		prefix := []byte(owner)
		for it.Seek(prefix); it.ValidForPrefix(prefix); it.Next() {
			if skipped <= skip {
				skip++
				continue
			}
			if took >= take {
				break
			}

			item := it.Item()
			k := item.Key()
			name := strings.Split(string(k), "/")[1]
			names = append(names, name)
			took++
		}
		return nil
	})
	return names, err
}

func (f *FileStorage) GetFileCountByOwner(owner string) (int, error) {
	count := 0
	err := f.db.View(func(txn *badger.Txn) error {
		it := txn.NewIterator(badger.DefaultIteratorOptions)
		defer it.Close()
		prefix := []byte(owner)
		for it.Seek(prefix); it.ValidForPrefix(prefix); it.Next() {
			count++
		}
		return nil
	})
	return count, err
}

func (f *FileStorage) GetFileByOwner(owner string, name string) ([]byte, error) {
	var value []byte
	err := f.db.View(func(txn *badger.Txn) error {
		b := []byte(owner + "/" + name)
		item, err := txn.Get(b)
		if err != nil {
			return err
		}
		err = item.Value(func(val []byte) error {
			copy(value, val)
			return nil
		})
		if err != nil {
			return err
		}
		return nil
	})
	return value, err
}
