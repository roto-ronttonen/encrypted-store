package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()

	r.Post("/api/files", func(w http.ResponseWriter, r *http.Request) {

	})

	http.ListenAndServe(":80", r)
}
