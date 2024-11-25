import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db, auth } from "../firebase/config";
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    };
  }

  componentDidMount() {
    db.collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(docs => {
        let arrayPosts = [];
        docs.forEach(doc => {
          arrayPosts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        this.setState({ posts: arrayPosts, loading: false });
      });
  }

  handleLike = (postId, likes) => {
    const user = auth.currentUser.email;
    if (likes.includes(user)) {
      db.collection('posts')
        .doc(postId)
        .update({
          likes: firebase.firestore.FieldValue.arrayRemove(user),
        });
    } else {
      db.collection('posts')
        .doc(postId)
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(user),
        });
    }
  };
  render() {
    const { posts, loading } = this.state;

    return (
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View>
                <Text>{item.data.email}</Text>
                <Text>{item.data.posteo}</Text>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => this.handleLike(item.id, item.data.likes)}
                >
                  <Icon
                    name={item.data.likes.includes(auth.currentUser.email) ? 'heart' : 'heart-o'} 
                    size={24} 
                    color='#28a745'  
                  />
                </TouchableOpacity>
                <Text >
                  {item.data.likes.length} {item.data.likes.length === 1 ? 'like' : 'likes'}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    );
  }
}


export default Posts;