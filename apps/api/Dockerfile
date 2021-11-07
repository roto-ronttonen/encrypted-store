FROM golang:1.16

WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o out

EXPOSE 3000

CMD ["/app/out"]