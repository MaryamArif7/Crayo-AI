import React from 'react';

export default function PopingLoader() {
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 pointer-events-auto">
            <div className="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
        </div>
    );
}
