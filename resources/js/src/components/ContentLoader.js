import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

// Content loader component - shows loading overlay
const ContentLoader = ({ open, message = "Loading..." }) => {
    if (!open) return null;

    return (
        <Dimmer active inverted>
            <Loader inverted>{message}</Loader>
        </Dimmer>
    );
};

export default ContentLoader;
