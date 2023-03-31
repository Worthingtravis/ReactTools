import React, { Suspense } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import withScrollToTop from './withScrollToTop';

import '@testing-library/jest-dom';

const DummyComponent = () => {
    return (
        <div className="divide-y divide-gray-800">
            <div className="flex py-4 px-2 text-gray-500">
                <div className="w-6/12">Collection</div>
                <div className="w-3/12 text-right">Volume</div>
                <div className="w-3/12 text-right">Floor</div>
            </div>
            <div style={{ height: '5000px' }} className={'scrollbar'} data-testid={'scrollbar'}>
                Dummy Component
            </div>
            ;
        </div>
    );
};

// Wrap the dummy component with the withScrollToTop HOC
const WrappedComponent = withScrollToTop(DummyComponent, { scrollableDivClass: 'scrollbar' });

describe('withScrollToTop HOC', () => {
    test('renders the wrapped component and the scroll-to-top button is initially hidden', () => {
        render(<WrappedComponent />);

        // select by class name
        expect(screen.getByTestId('scrollbar')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('displays the scroll-to-top button when scrolled past the minHeight', async () => {
        render(<WrappedComponent />);

        const scrollableDiv = screen.getByTestId('scrollbar');

        // Scroll the div past the minHeight
        fireEvent.scroll(scrollableDiv, { target: { scrollTop: 2000 } });

        // Expect the scroll-to-top button to be visible
        expect(await screen.findByRole('button')).toBeInTheDocument();
    });

    test('scrolls back to the top when the scroll-to-top button is clicked', async () => {
        render(<WrappedComponent />);

        const scrollableDiv = screen.getByTestId('scrollbar');
        scrollableDiv.scrollTo = jest.fn(); // Add mock scrollTo function

        // Scroll the div down
        fireEvent.scroll(scrollableDiv, { target: { scrollTop: 1000 } });

        // Click the scroll-to-top button
        const button = await screen.findByRole('button');
        userEvent.click(button);

        // Wait for the scrollTo function to be called
        await waitFor(() => {
            expect(scrollableDiv.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        });
    });
});
