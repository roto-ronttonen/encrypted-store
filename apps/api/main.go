package main

import (
	"context"
	appconfig "encyrpte-file-storage-api/app_config"
	"encyrpte-file-storage-api/persist"
	"errors"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	r := chi.NewRouter()

	fileStorage, err := persist.NewFileStorage(appconfig.BadgerDbDir)
	if err != nil {
		log.Fatal(err)
	}
	r.Use(middleware.Logger)
	// cors
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "*")
			w.Header().Set("Access-Control-Allow-Headers", "*")
			w.Header().Set("Access-Control-Allow-Credentials", "true")

			if r.Method == "OPTIONS" {
				return
			}
			next.ServeHTTP(w, r)
		})
	})
	// Check "auth" header
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := r.Header.Get("Identifier")

			// Sha512 hex should have 128 chars
			if len(user) != 128 {
				sendHttpJsonError(errors.New("invalid identifier"), "invalid identifier", http.StatusForbidden, w)
				return
			}
			// Add hex to context
			ctx := context.WithValue(r.Context(), "identifier", user)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	})

	r.Post("/api/files/{name}", func(w http.ResponseWriter, r *http.Request) {

		r.Body = http.MaxBytesReader(w, r.Body, 1024*1024*20)
		name := chi.URLParam(r, "name")
		if len(name) == 0 {
			sendHttpJsonError(errors.New("name not defined"), "Bad request", http.StatusBadRequest, w)
			return
		}
		data, err := ioutil.ReadAll(r.Body)
		if err != nil {
			sendHttpJsonError(err, "Bad request", http.StatusBadRequest, w)
			return
		}

		fileStorage.SaveFile(r.Context().Value("identifier").(string), name, data)
		sendHttpJsonResponse(map[string]string{"status": "ok"}, w)
	})

	// Returns names of files
	r.Get("/api/files", func(w http.ResponseWriter, r *http.Request) {
		skip, take := parseCommonListParams(r)
		owner := r.Context().Value("identifier").(string)
		count, err := fileStorage.GetFileCountByOwner(owner)
		if err != nil {
			sendHttpJsonError(err, "internal server error", http.StatusInternalServerError, w)
			return
		}

		fileNames, err := fileStorage.GetFileNamesByOwner(owner, take, skip)
		if err != nil {
			sendHttpJsonError(err, "internal server error", http.StatusInternalServerError, w)
			return
		}
		sendHttpJsonListResponse(fileNames, count, w)
	})

	// Get content of file
	r.Get("/api/files/{name}", func(w http.ResponseWriter, r *http.Request) {
		name := chi.URLParam(r, "name")
		if len(name) == 0 {
			sendHttpJsonError(errors.New("name not defined"), "Bad request", http.StatusBadRequest, w)
			return
		}
		owner := r.Context().Value("identifier").(string)
		data, err := fileStorage.GetFileByOwner(owner, name)
		if err != nil {
			sendHttpJsonError(err, "not found", http.StatusNotFound, w)
			return
		}

		w.Header().Set("Content-Type", "application/octet-stream")
		w.Write(data)
	})

	http.ListenAndServe(":5000", r)
}
