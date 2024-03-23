import React, { useState, useEffect, useContext } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { UiContext } from '../App';

const Nav = () => {
    const [showOptions, setShowOptions] = useState(false);
    const { setUi } = useContext(UiContext);
    const storedThemeSettings = JSON.parse(sessionStorage.getItem('themeSettings'));

    const [themeSettings, setThemeSettings] = useState(
        storedThemeSettings || {
            backgroundColor: '#3F83F8',
            textColor: '#000000',
            fontSizes: {
                h1: 24,
                h2: 20,
                p: 16,
            },
        }
    );

    // Function to handle background color change
    const handleBackgroundColorChange = (color) => {
        setThemeSettings((prevSettings) => ({
            ...prevSettings,
            backgroundColor: color,
        }));
    };

    // Function to handle text color change
    const handleTextColorChange = (color) => {
        setThemeSettings((prevSettings) => ({
            ...prevSettings,
            textColor: color,
        }));
    };

    // Function to handle font size change for different categories
    const handleFontSizeChange = (category, newSize) => {
        setThemeSettings((prevSettings) => ({
            ...prevSettings,
            fontSizes: {
                ...prevSettings.fontSizes,
                [category]: newSize,
            },
        }));
    };

    // Update session storage whenever theme settings change
    useEffect(() => {
        sessionStorage.setItem('themeSettings', JSON.stringify(themeSettings));
        setUi(themeSettings);
    }, [themeSettings, setUi]);

    return (
        <div className='relative' style={{backgroundColor: themeSettings.backgroundColor}}>
            <div className='flex items-center justify-between w-full h-20 border p-4'>
                <div className='w-12 h-full'>
                    <img
                        className='w-full h-full object-cover'
                        src="https://varad177.github.io/portfolio/assets/hero.jpg"
                        alt="logo"
                    />
                </div>
                <div className='p-4 flex items-center justify-center'>
                    <MenuIcon onClick={() => setShowOptions(!showOptions)} className="cursor-pointer" style={{background: themeSettings.backgroundColor === '#000000'? 'white' : ''}} />
                </div>
            </div>

            {/* Overlay for background blur */}
            {showOptions && (
                <div onClick={() => setShowOptions(!showOptions)} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-40"></div>
            )}

            {/* Popup settings panel */}
            {showOptions && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-6 rounded-lg shadow-lg border w-96"
                    style={{ backgroundColor: themeSettings.backgroundColor }}>
                    <div className="mb-6">
                        <label htmlFor="backgroundColor" className="block mb-2 font-semibold">Background Color:</label>
                        <input
                            id="backgroundColor"
                            type="color"
                            value={themeSettings.backgroundColor}
                            onChange={(e) => handleBackgroundColorChange(e.target.value)}
                            className="mb-2 border border-gray-300 rounded-md w-full py-1 px-2"
                        />
                        {/* Basic color combinations */}
                        <div className="flex justify-between mt-2">
                            {['#ffffff', '#f0f0f0', '#000000', '#ff0000', '#00ff00'].map((color) => (
                                <div
                                    key={color}
                                    className="rounded-full h-6 w-6 cursor-pointer"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleBackgroundColorChange(color)}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="textColor" className="block mb-2 font-semibold">Text Color:</label>
                        <input
                            id="textColor"
                            type="color"
                            value={themeSettings.textColor}
                            onChange={(e) => handleTextColorChange(e.target.value)}
                            className="mb-2 border border-gray-300 rounded-md w-full py-1 px-2"
                        />
                        {/* Basic color combinations */}
                        <div className="flex justify-between mt-2">
                            {['#ffffff', '#f0f0f0', '#000000', '#ff0000', '#00ff00'].map((color) => (
                                <div
                                    key={color}
                                    className="rounded-full h-6 w-6 cursor-pointer"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleTextColorChange(color)}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="h1FontSize" className="block mb-2 font-semibold">H1 Font Size:</label>
                        <input
                            id="h1FontSize"
                            type="number"
                            min="10"
                            max="50"
                            value={themeSettings.fontSizes.h1}
                            onChange={(e) => handleFontSizeChange('h1', parseInt(e.target.value))}
                            className="mb-2 border border-gray-300 rounded-md w-full py-1 px-2"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="h2FontSize" className="block mb-2 font-semibold">H2 Font Size:</label>
                        <input
                            id="h2FontSize"
                            type="number"
                            min="10"
                            max="50"
                            value={themeSettings.fontSizes.h2}
                            onChange={(e) => handleFontSizeChange('h2', parseInt(e.target.value))}
                            className="mb-2 border border-gray-300 rounded-md w-full py-1 px-2"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="pFontSize" className="block mb-2 font-semibold">Paragraph Font Size:</label>
                        <input
                            id="pFontSize"
                            type="number"
                            min="10"
                            max="50"
                            value={themeSettings.fontSizes.p}
                            onChange={(e) => handleFontSizeChange('p', parseInt(e.target.value))}
                            className="mb-2 border border-gray-300 rounded-md w-full py-1 px-2"
                        />
                    </div>

                    {/* Centered UI box to reflect changes */}
                    <div className="text-center">
                        <h1 style={{ fontSize: `${themeSettings.fontSizes.h1}px`, color: themeSettings.textColor }} className="mb-4">Heading 1</h1>
                        <h2 style={{ fontSize: `${themeSettings.fontSizes.h2}px`, color: themeSettings.textColor }} className="mb-4">Heading 2</h2>
                        <p style={{ fontSize: `${themeSettings.fontSizes.p}px`, color: themeSettings.textColor }}>Lorem ipsum dolor sit amet.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nav;
