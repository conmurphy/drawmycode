package main

import "strings"

func joinMoreStrings(words []string) string {
	secondVar := "In joinstrings"
	return strings.Join(words, ", ")
}

func SecondSeparateFunction(words []string) {
	fourthVar := "separatefunction"
	joinMoreStrings(words)
}

func ThirdFunction(words []string) {
	fourthVar := "separatefunction"
	joinStrings(words)
}
