import * as React from "react";
import Button from "@mui/material/Button";
import classNames from "classnames";

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import DefaultImage from "../default-image"

const Image = React.forwardRef(({ alt, classes, fileRef, src }, ref) => {
    const [ file, setFile ] = React.useState({
        input: "",
        url: src
    });

    const inputRef = React.useRef(null);

    const changeHandler = React.useCallback(e => {
        const inputFile = event.target.files[0];
        
        if(inputFile) {
            const reader = new FileReader();

            reader.onload = event => {
                setFile({
                    input: inputFile,
                    url: event.target.result
                })
            };

            reader.readAsDataURL(inputFile);
        }
    }, []);

    const clickHandler = React.useCallback(() => {
        inputRef.current?.click();
    }, []);

    React.useEffect(() => {
        fileRef.current = file.input;
    }, [ file, fileRef ])

    return (
        <Button 
            className={classNames(classes?.root, { "flex items-center justify-center": !Boolean(file.url)})}
            onClick={clickHandler}>
            {
                Boolean(file.url) ? 
                    <DefaultImage
                        alt={alt ?? ""}
                        layout="fill"
                        src={file.url}
                    />
                    : <AddPhotoAlternateIcon className="text-4xl" />
            }
            <input 
                className="hidden"
                onChange={changeHandler}
                ref={inputRef}
                type="file"
            />
        </Button>
    );
});

Image.displayName = 'Image';

export default Image;