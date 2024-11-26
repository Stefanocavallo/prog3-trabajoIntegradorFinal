import React, { Component } from "react";
import { Text, View, FlatList, TouchableOpacity} from "react-native";
import { auth, db } from "../firebase/config";
import "firebase/firestore";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailUser: '',
            userName: '',
            userPosts: [],
        };
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('logeado okay');
                console.log(auth.currentUser);
                this.setState({ profiles: auth.currentUser });
                const mailUser = auth.currentUser.email;
                db.collection('users').onSnapshot(
                    docs => {
                        docs.forEach(
                            doc => {
                                if (doc.data().email) {
                                    this.setState({
                                        emailUser: doc.data().email,
                                        userName: doc.data().username,
                                    });
                                }
                            }
                        );
                    }
                )
                db.collection('posts').where('email', '==', mailUser).onSnapshot(
                    docs => {
                        let posts = [];
                        docs.forEach(doc => {
                            posts.push({
                                data: doc.data(),
                                id: doc.id,
                            });
                        });
                        this.setState({
                            postsUser: posts,
                            isLoading: false
                        });
                    },
                    error => {
                        console.error(error);
                        this.setState({ isLoading: false });
                    }
                );
            }
        });
    }
    handleEliminarPost = (idPost) => {
        db.collection("posts")
            .doc(idPost)
            .delete()
            .then(() => {
                console.log("Post eliminado");
            })
            .catch((error) => {
                console.log(error);
            })
    }
    handleLogOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Logout checked");
                this.props.navigation.navigate("Login");
            })
            .catch((error) => {
                console.error(error);
            })
    }
    render() {
        return (
            <View>
                <TouchableOpacity onPress={this.handleLogOut}>
                    <Text >Cerrar sesión</Text>
                </TouchableOpacity>
                <Text>Mi perfil</Text>
                <View>
                    <Text>Email: {this.state.emailUser}</Text>
                    <Text>Nombre de Usuario: {this.state.user}</Text>
                    <Text>Publicaciones realizadas: {this.state.userPosts.length}</Text>
                </View>
                <FlatList
                    data={this.state.userPosts}
                    keyExtractor={(item) => item.id}
                    renderItemtem={({ item }) => (
                        <View>
                        <View>
                            <Text>{item.data.userName}</Text>
                        </View>
                        <View>
                            <Text>Likeado por {item.data.likes ? item.data.likes.length : 0}</Text>
                            <View>
                                {(auth.currentUser.mailUser === item.data.email) && (
                                       <TouchableOpacity onPress={() => this.deletePost(item.id)}>
                                       <Text>Eliminar post</Text>
                                   </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                    )}
                />
            </View>
        )
    }
}

export default Profile