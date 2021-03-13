import React, { useState } from 'react';
import '../../styles/NewFile.css';

import AddIcon from '@material-ui/icons/Add';

import firebase from 'firebase';
import { storage, db } from '../../firebase';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
    return {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const NewFile = ({ userId }) => {
    const classes = useStyles();

    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        if (e.target.files[0]) {
            console.log('File');
            const fileToUpload = e.target.files[0];
            // validate fileToUpload.name
            Object.defineProperty(fileToUpload, 'urlName', {
                writable: true,
                value: `${fileToUpload.name.replaceAll(' ', '_')}`,
            });
            console.log(fileToUpload);
            setFile(fileToUpload);
        }
    };

    const handleUpload = () => {
        setUploading(true);

        console.log(file.urlName, 'URL NAME!');

        storage
            .ref(`files/${file.urlName}`)
            .put(file)
            .then((snapshot) => {
                console.log(snapshot);

                storage
                    .ref('files')
                    .child(file.urlName)
                    .getDownloadURL()
                    .then((url) => {
                        //post image inside the db

                        db.collection('myFiles').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: file.name,
                            fileUrl: url,
                            size: snapshot._delegate.bytesTransferred,
                            userId: userId,
                        });

                        setUploading(false);
                        setOpen(false);
                        setFile(null);
                    });

                storage
                    .ref('files')
                    .child(file.urlName)
                    .getMetadata()
                    .then((meta) => {
                        console.log(meta.size);
                    });
            })
            .catch((err) => {
                console.log('Error while uploading...', err);
            });
    };

    return (
        <div className="newFile">
            <div className="newFile__container" onClick={handleOpen}>
                <AddIcon fontSize="large" />
                <p>New</p>
            </div>

            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <div style={modalStyle} className={classes.paper}>
                    <p>Select files you want to upload!</p>
                    {uploading ? (
                        <p>Uploading...</p>
                    ) : (
                        <>
                            <input type="file" onChange={handleChange} />
                            <button onClick={handleUpload}>Upload</button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default NewFile;
