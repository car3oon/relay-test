let React    = require('react');
let ReactDOM = require('react-dom');
let Relay    = require('react-relay');

class Item extends React.Component {
  render() {
    let user = this.props.store.user;

    return (
      <div>
        <h2>{user.screen_name}</h2>
        <p>Name: {user.name}</p>
        <p>Number of tweets: {user.tweets_count}</p>
        <p>Website: <a href={user.url} target="_blank">{user.url}</a></p>
        <img src={user.profile_image_url} />
        <hr />
      </div>
    );
  }
};

Item = Relay.createContainer(Item, {
  fragments: {
    store: () => Relay.QL`
      fragment on TwitterAPI {
        user (identifier: name, identity: "car3oon") {
          id
          name
          screen_name
          profile_image_url
          tweets_count
          url
        }
      }
    `,
  },
});

class TwitterRoute extends Relay.Route {
  static routeName = 'TwitterRoute';
  static queries = {
    store: ((Component) => {
      return Relay.QL`
      query root {
        twitter { ${Component.getFragment('store')} },
      }
    `}),
  };
}

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('https://www.graphqlHub.com/graphql')
);

let mountNode = document.getElementById('container');
let rootComponent = <Relay.RootContainer
  Component={Item}
  route={new TwitterRoute()} />;
ReactDOM.render(rootComponent, mountNode);
