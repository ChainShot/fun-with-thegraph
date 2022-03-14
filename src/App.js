import {
  ApolloClient, ApolloProvider, gql, InMemoryCache, useQuery
} from '@apollo/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

const boredApeUri = 'https://api.thegraph.com/subgraphs/name/dabit3/boredapeyachtclub';

const client = new ApolloClient({
  uri: boredApeUri,
  cache: new InMemoryCache(),
});

const BORED_APES = gql`
  query BoredApesQuery {
    tokens(first: 5) {
      id
      tokenID
      contentURI
      imageURI
      eyes
    }
  }
`;

// const BORED_APES = gql`
//   query BoredApesQuery {
//     tokens(first: 5, where: { eyes_contains: "Blindfold" }) {
//       id
//       tokenID
//       contentURI
//       imageURI
//       eyes
//     }
//   }
// `;

function BoredApes() {
  const [tokens, setTokens] = useState([]);
  const { loading, error, data } = useQuery(BORED_APES);

  useEffect(() => {
    async function fetchTokenContents() {
      if (loading) {
        return;
      }

      const tkns = await Promise.all(
        data.tokens.map(async (token) => {
          const response = await axios.get(`https://${token.contentURI}`);

          return {
            ...token,
            content: response.data
          };
        })
      );
      
      tkns.forEach(token => {
        token.contentURI = `https://${token.contentURI}`;

        const [, cid] = token.content.image.split('//');
        token.content.image = `https://ipfs.io/ipfs/${cid}`;
      });

      setTokens(tkns);
    }

    fetchTokenContents();
  }, [loading, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="bored-apes-container">
      {tokens.map(({ id, tokenID, contentURI, content }) => (
        <div
          key={id}
          className="bored-app-div row"
          style={{ fontSize: '12px' }}
        >
          <hr />
          <div className="column">
            <div>id: {id}</div>
            <div>tokenID: {tokenID}</div>
            <div>
              contentURI: <a href={contentURI}>{contentURI}</a>
            </div>
            <div>metadata content:</div>
            <pre>{JSON.stringify(content, undefined, 2)}</pre>
          </div>
          <div className="column">
            <img
              src={content.image}
              style={{ paddingLeft: '100px' }}
              width="400"
              height="400"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h2>BoredApe Subgraph GraphQL App</h2>
        </header>
        <BoredApes />
      </div>
    </ApolloProvider>
  );
}

export default App;
