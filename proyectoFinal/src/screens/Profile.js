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
                                if (doc.data().owner === mailUser) {
                                    this.setState({
                                        emailUser: doc.data().owner,
                                        userName: doc.data().username
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
            <View style={styles.container}>
                <TouchableOpacity style={styles.register} onPress={this.handleLogOut}>
                    <Text style={styles.buttonText}>Cerrar sesión</Text>
                </TouchableOpacity>
                <Text style={styles.opciones}>Mi perfil</Text>
                <View style={styles.infoPerfil}>
                    <Text style={styles.datosPerfil}>Email: {this.state.emailUser}</Text>
                    <Text style={styles.datosPerfil}>Nombre de Usuario: {this.state.user}</Text>
                    <Text style={styles.datosPerfil}>Publicaciones realizadas: {this.state.userPosts.length}</Text>
                </View>
                <FlatList
                    data={this.state.userPosts}
                    keyExtractor={(item) => item.id}
                    renderItemtem={({ item }) => (
                        <View style={styles.postCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.userName}>{item.data.userName}</Text>
                        </View>
                        <View style={styles.footer}>
                            <Text style={styles.likes}>Likeado por {item.data.likes ? item.data.likes.length : 0}</Text>
                            <View style={styles.iconContainer}>
                                {(auth.currentUser.mailUser === item.data.email) && (
                                       <TouchableOpacity style={styles.borrar} onPress={() => this.deletePost(item.id)}>
                                       <Text style={styles.boronBorrar}>Eliminar post</Text>
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