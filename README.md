

1. Play around with the following subgraph and see if you can come up with 3 interesting/fun queries:
    * https://thegraph.com/hosted-service/subgraph/dabit3/boredapeyachtclub?version=current
2. Clone this repo and implement the queries in a React app:

    a. `git clone git@github.com:ChainShot/fun-with-thegraph.git`

    b. `npm i`
    
    c. `npm start`

Some example queries:
```
{
  tokens(first: 5) {
    id
    tokenID
    contentURI
    imageURI
    eyes
  }
}
```

```
{
  tokens(first: 5, where: { eyes_contains: "Blindfold"}) {
    id
    tokenID
    contentURI
    imageURI
    eyes
  }
}
```