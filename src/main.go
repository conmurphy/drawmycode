package main

import (
	"encoding/json"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"log"
	"os"
	"strings"

	"github.com/davecgh/go-spew/spew"
	//"github.com/davecgh/go-spew/spew"
)

type FunctionDecs struct {
	ID                      int        `json:"id,omitempty"`
	Name                    string     `json:"Name,omitempty"`
	Package                 string     `json:"Package,omitempty"`
	Group                   int        `json:"Group,omitempty"`
	Called                  bool       `json:"Called,omitempty"`
	OriginatingFunctionName string     `json:"OriginatingFunction,omitempty"`
	Position                string     `json:"Position,omitempty"`
	Color                   string     `json:"Color,omitempty"`
	Variables               []Variable `json:"Variables,omitempty"`
}

type Nodes struct {
	ID                      int        `json:"id,omitempty"`
	Name                    string     `json:"Name,omitempty"`
	Package                 string     `json:"Package,omitempty"`
	OriginatingFunctionName string     `json:"OriginatingFunctionName,omitempty"`
	Position                string     `json:"Position,omitempty"`
	Group                   int        `json:"Group,omitempty"`
	Color                   string     `json:"Color,omitempty"`
	Variables               []Variable `json:"Variables,omitempty"`
}

type Links struct {
	Source              int    `json:"source,omitempty"`
	Target              int    `json:"target,omitempty"`
	OriginatingFunction string `json:"originatingFunction,omitempty"`
}

type NodeSets struct {
	ID    int    `json:"id,omitempty"`
	Nodes []int  `json:"nodes,omitempty"`
	Label string `json:"label,omitempty"`
}

type Variable struct {
	ID     int      `json:"id,omitempty"`
	Names  []Names  `json:"Names,omitempty"`
	Types  []Types  `json:"Types,omitempty"`
	Values []Values `json:"Values,omitempty"`
}

type Names struct {
	ID   int    `json:"id,omitempty"`
	Name string `json:"Name,omitempty"`
}

type Types struct {
	ID  int    `json:"id,omitempty"`
	Typ string `json:"Type,omitempty"`
}

type Values struct {
	ID    int    `json:"id,omitempty"`
	Value string `json:"Value,omitempty"`
}

type visitor int

var currentFunctionDeclaration string
var currentFunctionDeclarationID int
var currentFunctionDeclarationGroup int

var functionDecs []FunctionDecs
var nodeOutput []Nodes
var linkOutput []Links
var nodeSets []NodeSets
var variables []Variable

var group int = 1

func main() {

	var v visitor

	if len(os.Args) < 2 {
		fmt.Fprintf(os.Stderr, "usage:\n\t%s [files]\n", os.Args[0])
		os.Exit(1)
	}

	fs := token.NewFileSet()

	astPkgs, err := parser.ParseDir(fs, os.Args[1], func(info os.FileInfo) bool {
		name := info.Name()
		return !info.IsDir() && !strings.HasPrefix(name, ".") && strings.HasSuffix(name, ".go")
	}, parser.ParseComments)

	if err != nil {
		fmt.Println("Error parsing directory")
	}
	for _, p := range astPkgs {
		for i, _ := range p.Files {
			node, err := parser.ParseFile(fs, i, nil, parser.AllErrors)

			if err != nil {
				log.Printf("could not parse %s: %v", i, err)
				continue
			}
			ast.Walk(v, node)
			//ast.Print(fs, node)

		}

	}

	// If it hasn't been called then we still need to display it in the topology and so add it to the node list
	for i := range functionDecs {

		if functionDecs[i].Called == false {
			nodes := Nodes{
				ID:                      functionDecs[i].ID,
				Name:                    functionDecs[i].Name,
				Package:                 functionDecs[i].Package,
				Position:                functionDecs[i].Position,
				OriginatingFunctionName: "",
				Variables:               functionDecs[i].Variables,
			}

			nodeOutput = append(nodeOutput, nodes)
		}
	}

	// Build the links between the nodes
	for i := range nodeOutput {
		for j := range nodeOutput {
			if nodeOutput[i].OriginatingFunctionName == nodeOutput[j].Name {
				links := Links{
					Source: nodeOutput[j].ID,
					Target: nodeOutput[i].ID,
				}

				linkOutput = append(linkOutput, links)

			}
		}
	}

	// Copy the variables from the Function Declarations to the nodes of the same name
	for i := range functionDecs {
		for j := range nodeOutput {
			if nodeOutput[j].Name == functionDecs[i].Name {
				nodeOutput[j].Variables = functionDecs[i].Variables
				spew.Dump(nodeOutput[j].Variables)
			}
		}
	}

	// Update the colour of the root nodes
	for i := range nodeOutput {
		if nodeOutput[i].Position == "Root" {
			nodeOutput[i].Color = "#513B56"
		}
	}

	/*

		**************************************
		****							  ****
		**** 	GROUPS BASED ON TREES	  ****
		****							  ****
		**************************************

		for i := range nodeOutput {
			if nodeOutput[i].Position == "Root" {
				nodeOutput[i].Group = group
				group += 1
			}
		}

		newSourcePos := -1

		for i := range nodeOutput {
			if nodeOutput[i].Position == "Root" {

				for j := range linkOutput {
					if nodeOutput[i].ID == linkOutput[j].Source {
						newSourcePos = linkOutput[j].Target
					}
				}

				if newSourcePos != -1 {

					addGroup(newSourcePos, nodeOutput[i].Group)
				}

			}

		}*/

	// Create a list of all the packages in use so that we can group nodes by package
	unique := make([]string, 0, len(nodeOutput))
	m := make(map[string]bool)

	for i := range nodeOutput {

		pkg := nodeOutput[i].Package

		if _, ok := m[pkg]; !ok {
			m[pkg] = true
			unique = append(unique, pkg)
		}

	}

	// Assign groups to nodes
	for i := range nodeOutput {

		for j := range unique {

			if nodeOutput[i].Package == unique[j] {
				nodeOutput[i].Group = j + 1

			}
		}

	}

	/*
		**************************************
		****							  ****
		**** NODE SETS - UNCOMMENT TO USE ****
		****							  ****
		**************************************

		var nodes []int
		var id int

		for j := range unique {
			nodes = nil
			id = 0
			for i := range nodeOutput {

				if nodeOutput[i].Package == unique[j] {
					id += nodeOutput[i].ID + 1
					nodes = append(nodes, nodeOutput[i].ID)

				}
			}

			newNodeSet := NodeSets{
				ID:    id,
				Nodes: nodes,
				Label: unique[j],
			}

			nodeSets = append(nodeSets, newNodeSet)

		}

	*/

	output := "var topologyData = {	nodes: "

	marshalled, err := json.Marshal(nodeOutput)
	if err != nil {
		fmt.Println(err)
	}
	output += string(marshalled)

	output += ",links:"

	marshalled, err = json.Marshal(linkOutput)
	if err != nil {
		fmt.Println(err)
	}
	output += string(marshalled)

	output += ",nodeSet:"

	marshalled, err = json.Marshal(nodeSets)
	if err != nil {
		fmt.Println(err)
	}

	output += string(marshalled)

	output += "};"

	fmt.Println(output)

}

func (v visitor) Visit(n ast.Node) ast.Visitor {

	if n == nil {
		return nil
	}

	fn, ok := n.(*ast.FuncDecl)

	if ok {

		found := false
		for i := range functionDecs {
			if functionDecs[i].Name == fn.Name.Name {
				found = true
				break
			}
		}

		if !found {

			currentFunctionDeclaration = fn.Name.Name
			currentFunctionDeclarationID = int(fn.Name.NamePos)

			functionDec := FunctionDecs{
				ID:                      int(fn.Name.NamePos),
				Name:                    fn.Name.Name,
				Package:                 "This",
				Called:                  false,
				OriginatingFunctionName: fn.Name.Name,
				Position:                "Root",
				Color:                   "#348AA7",
			}

			functionDecs = append(functionDecs, functionDec)

			for i := range nodeOutput {
				if nodeOutput[i].Name == fn.Name.Name {
					functionDecs[len(functionDecs)-1].Called = true

				}
			}
		}

	}

	ce, ok := n.(*ast.CallExpr)
	if ok {
		selector, ok := ce.Fun.(*ast.SelectorExpr)

		if ok {
			functionCall := selector.Sel.Name

			pkg := selector.X.(*ast.Ident)

			nodes := Nodes{
				ID:                      int(selector.Sel.NamePos),
				Name:                    functionCall,
				Package:                 pkg.Name,
				Position:                "Branch",
				OriginatingFunctionName: currentFunctionDeclaration,
				Color: "#348AA7",
			}

			nodeOutput = append(nodeOutput, nodes)

			for i := range functionDecs {
				if functionDecs[i].Name == functionCall {
					functionDecs[i].Called = true
				}
			}

		}

		ident, ok := ce.Fun.(*ast.Ident)

		if ok {
			functionCall := ident.Name

			nodes := Nodes{
				ID:                      int(ident.NamePos),
				Name:                    functionCall,
				Package:                 "This",
				Position:                "Branch",
				OriginatingFunctionName: currentFunctionDeclaration,
				Color: "#348AA7",
			}

			nodeOutput = append(nodeOutput, nodes)

			for i := range functionDecs {
				if functionDecs[i].Name == functionCall {
					functionDecs[i].Called = true
				}
			}

		}

	}

	//var variables []Variable

	variable, ok := n.(*ast.AssignStmt)
	var names []Names
	var values []Values
	var types []Types

	// Parse the left hand side for names and the right hand side for values and types

	if ok {
		variableLHS := variable.Lhs
		variableRHS := variable.Rhs

		for i := range variableLHS {
			variableNames, ok := variableLHS[i].(*ast.Ident)

			if ok {

				name := Names{
					ID:   int(variableNames.NamePos),
					Name: variableNames.Name,
				}

				names = append(names, name)
			}
		}

		for i := range variableRHS {
			variableValues, ok := variableRHS[i].(*ast.BasicLit)

			if ok {

				value := Values{
					ID:    int(variableValues.ValuePos),
					Value: variableValues.Value,
				}

				values = append(values, value)

				typ := Types{
					ID:  int(variableValues.ValuePos),
					Typ: variableValues.Kind.String(),
				}

				types = append(types, typ)

			}
		}

		variableNames, ok := variableLHS[0].(*ast.Ident)

		variableID := 0

		if ok {
			variableID = int(variableNames.NamePos)
		}

		variable := Variable{
			ID:     variableID,
			Names:  names,
			Values: values,
			Types:  types,
		}

		// first add it to the current function declaration and then once everything has been found we will add it to the node to be displayed
		for i := range functionDecs {
			if functionDecs[i].Name == currentFunctionDeclaration {
				functionDecs[i].Variables = append(functionDecs[i].Variables, variable)
			}
		}

	}

	return v + 1
}

/*func addGroup(newSourcePos int, groupID int) {

	fmt.Println("Source")
	fmt.Println(newSourcePos)

	for i := range nodeOutput {

		if nodeOutput[i].ID == newSourcePos {
			nodeOutput[i].Group = groupID
		}
	}
	for j := range linkOutput {
		if newSourcePos == linkOutput[j].Source {
			addGroup(linkOutput[j].Target, groupID)
		}
	}

}*/
