import * as React from "react";
import Image from "next/image"
import { styled } from "@mui/material/styles";

import ErrorImage from "public/images/error-image.png"

const CustomImage = styled(Image)({
    '&': {
        height: '100% !important',
        width: "100% !important"
    }
});

const ImageContainer = ({ src, ...rest }) => {
    const [ image, setImage ] = React.useState(src);

    const errorHandler = React.useCallback(() => setImage(ErrorImage), []);

    return (
        <CustomImage
            { ...rest } 
            onError={errorHandler}
            src={image}
        />
    );
    
}
export default ImageContainer;