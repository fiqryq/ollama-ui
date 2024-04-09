#!/bin/bash

check_ollama_installed() {
    if ! command -v ollama &> /dev/null; then
        echo "Ollama is not installed. Installing..."
        brew install ollama
    else
        echo "Ollama is already installed."
    fi
}

check_ollama_installed

docker build -t ollama-ui .

echo "Setup completed successfully."
