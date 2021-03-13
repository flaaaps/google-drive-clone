import React from 'react';
import '../../styles/FileCard.css';

import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const FileCard = ({ name, url }) => {
    return (
        <a href={url} target="_blank" rel="noreferrer" className="fileCard">
            <div className="fileCard--top">
                <InsertDriveFileIcon style={{ fontSize: 130 }} />
            </div>

            <div className="fileCard--bottom">
                <p>{name}</p>
            </div>
        </a>
    );
};

export default FileCard;
