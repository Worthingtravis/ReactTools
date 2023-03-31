import React, { useState, useEffect } from 'react';
import { ArrowUp } from '@/components/Icons';

// withScrollToTop is a higher-order component (HOC) that adds a scroll-to-top button
// to the wrapped component based on the provided configuration.
const withScrollToTop = (WrappedComponent, config = {}) => {
    // Set default configuration values
    const defaultConfig = {
        minHeight: 0, // 0 by default, will be updated later
        showAtBottom: false, // Show button only when the page is scrolled to the bottom
        // ** IMPORTANT ** The scrollable div must have this class name
        scrollableDivClass: 'scrollbar', // Default class for the scrollable div
        ...config,
    };

    // The HOC returns a new component that wraps the original component
    return (props) => {
        // State variable to determine whether the scroll-to-top button should be shown
        const [showButton, setShowButton] = useState(false);

        // Event handler for the scroll event
        const handleScroll = (e) => {
            const { scrollHeight, scrollTop, clientHeight } = e.target;
            const isAtEnd = scrollTop + clientHeight >= scrollHeight;

            // Show the button based on the configuration settings
            if (defaultConfig.showAtBottom) {
                setShowButton(isAtEnd);
            } else {
                setShowButton(scrollTop >= defaultConfig.minHeight);
            }
        };

        // useEffect hook to handle adding and removing the scroll event listener
        useEffect(() => {
            // Find the scrollable div using the provided class name from the configuration
            const scrollableDiv = document.querySelector(`.${defaultConfig.scrollableDivClass}`);

            // If the scrollable div exists, add the scroll event listener
            if (scrollableDiv) {
                defaultConfig.minHeight = scrollableDiv.clientHeight;
                scrollableDiv.addEventListener('scroll', handleScroll);
            }

            // Clean up by removing the event listener when the component is unmounted
            return () => {
                if (scrollableDiv) {
                    scrollableDiv.removeEventListener('scroll', handleScroll);
                }
            };
        }, []);

        // Function to smoothly scroll the content back to the top
        const scrollToTop = () => {
            const scrollableDiv = document.querySelector(`.${defaultConfig.scrollableDivClass}`);
            if (scrollableDiv) {
                scrollableDiv.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        // Render the wrapped component along with the scroll-to-top button (if applicable)
        return (
            <>
                <WrappedComponent {...props} />
                {showButton && (
                    <button role={'button'} onClick={scrollToTop} style={{ position: 'fixed', bottom: 10, right: 10 }}>
                        <ArrowUp className="text-secondary-700" fill="white" />
                    </button>
                )}
            </>
        );
    };
};

export default withScrollToTop;
