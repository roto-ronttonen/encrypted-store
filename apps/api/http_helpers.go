package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type httpJsonListResponse struct {
	Data       interface{} `json:"data"`
	TotalCount int         `json:"totalCount"`
}

func sendHttpJsonListResponse(data interface{}, totalCount int, w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	// If length is zero return empty slice instead of nil
	if data == nil {
		data = make([]string, 0)
	}
	response := httpJsonListResponse{
		Data:       data,
		TotalCount: totalCount,
	}
	json.NewEncoder(w).Encode(response)
}

func sendHttpJsonResponse(data interface{}, w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(data)
}

type httpJsonErrorResponse struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
}

func sendHttpJsonError(err error, message string, status int, w http.ResponseWriter) {
	log.Println(err)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	response := httpJsonErrorResponse{
		Message: message,
		Status:  status,
	}
	json.NewEncoder(w).Encode(response)
}

func parseCommonListParams(r *http.Request) (int, int) {
	take := r.URL.Query().Get("take")
	skip := r.URL.Query().Get("skip")

	takeI, err := strconv.Atoi(take)
	if err != nil {
		takeI = 10
	}
	skipI, err := strconv.Atoi(skip)
	if err != nil {
		skipI = 0
	}
	return skipI, takeI
}
