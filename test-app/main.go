package main

import "fmt"
import "strings"

// SayHello says Hello
func SayHello(words []string) {
	fmt.Println(joinStrings(words))
}

func main() {
	firstVar, test := "Hello"
	secondVar := "World"
	words := []string{firstVar, secondVar}
	SayHello(words)
}

// joinStrings joins strings
func joinStrings(words []string) string {

	return strings.Join(words, ", ")
}

func SeparateFunction(words []string) {
	//SayHello(words)
	//fmt.Println(joinStrings(words))
	FunctionDeclarationWithoutFunctionCalls(words)
}

func FunctionDeclarationWithoutFunctionCalls(words []string) {
	fmt.Println("test")
	fmt.Println("test")
	fmt.Println("test")
	FunctionDeclarationWithoutFunctionCalls(words)
}
