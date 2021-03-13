import './App.css';
import Header from './components/header';
import Sidebar from './components/sidebar';
import FilesView from './components/filesView/FilesView';
import SideIcons from './components/sideIcons';
import Loader from './components/loader';

import GDriveLogo from './media/google-drive-logo.png';
import GHLogo from './media/github/GitHub-Mark-Light-32px.png';
import GLogo from './media/google.png';

import { auth, provider, githubProvider } from './firebase';
import firebase from 'firebase';
import { useState, useEffect } from 'react';

function App() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();
    // const [user, setUser] = useState({
    //   displayName: "David Rakosi",
    //   email: "david@cleverprogrammer.com",
    //   emailVerified: true,
    //   phoneNumber: null,
    //   photoURL: "https://lh6.googleusercontent.com/-KyLTWqvDIHQ/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclcWGWqkt6YUAan32YO4CSR07Y2jw/s96-c/photo.jpg"
    // })

    useEffect(() => {
        console.log(firebase.auth.Auth.Persistence.LOCAL, 'LOCAL PERS');
        auth.onAuthStateChanged(function (newUser) {
            if (newUser != null) {
                console.log('MY USER!', newUser);
                setUser(newUser);
            } else {
                console.log('UNKNOWN USER!');
                setUser(null);
            }
            setLoading(false);
        });
    }, [user]);

    const handleLogin = (type) => {
        if (!user) {
            if (type === 'google') {
                auth.signInWithPopup(provider)
                    .then((result) => {
                        console.log(result, 'AUTH RESULT!');
                        setUser(result.user);
                        console.log(result.user);
                    })
                    .catch((error) => {
                        console.log('Error while signing in with google:', error.message);
                    });
            } else if (type === 'github') {
                auth.signInWithPopup(githubProvider)
                    .then((result) => {
                        console.log(result, 'AUTH RESULT!');
                        setUser(result.user);
                        console.log(result.user);
                    })
                    .catch((error) => {
                        console.log('Error while signing in with github:', error.message);
                    });
            }
        } else if (user) {
            auth.signOut()
                .then(() => {
                    setUser(null);
                })
                .catch((err) => console.log('Error while signing out:', err.message));
        }
    };

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                setUser(null);
            })
            .catch((err) => console.log('Error while signing out:', err.message));
    };

    return (
        <div className="app">
            {!loading ? (
                <div id="content">
                    {user ? (
                        <>
                            <Header userPhoto={user.photoURL} handleLogout={handleLogout} />
                            <div className="app__main">
                                <Sidebar userId={user.uid} />
                                <FilesView userId={user.uid} />
                                <SideIcons />
                            </div>
                        </>
                    ) : (
                        <div className="app__login">
                            <img src={GDriveLogo} alt="Google Drive" />
                            <div className="login-wrapper">
                                <div className="login-info">
                                    <h3>Get started!</h3>
                                    <p>Sign in with Google or GitHub to continue</p>
                                </div>
                                <div className="button-wrapper">
                                    <button onClick={() => handleLogin('google')} className="google">
                                        <img src={GLogo} alt="Google" />
                                    </button>
                                    <button onClick={() => handleLogin('github')} className="github">
                                        <img src={GHLogo} alt="GitHub" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Loader />
            )}
        </div>
    );
}

export default App;
