% This is a simple Prolog program for testing the Nearley grammar.

% Facts:
father(john, mary).
father(john, tom).
mother(susan, mary).
mother(susan, tom).
person(john).
person(susan).
age(john, 45).
age(susan, 42).

% Rules:
parent(X, Y) :- father(X, Y) ; mother(X, Y). % X is a parent of Y if X is father OR X is mother
grandparent(X, Y) :- parent(X, Z), parent(Z, Y). % X is grandparent of Y if X is parent of Z AND Z is parent of Y

% A more complex rule using a structure and a list
has_hobbies(Person, Hobbies) :-
    person(Person),
    Hobbies = [reading, sports, coding].

% Example with numbers and different operators
calculate_value(X, Y, Result) :-
    Result is (X * Y) + 10 / 2.

/* % Anonymous variable example
some_fact(_, value).

% String example
message('Hello, Prolog!'). */

% A rule with a cut
/* find_first_child(Parent, Child) :-
    parent(Parent, Child),
    !. */