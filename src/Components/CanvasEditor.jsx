import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as fabric from 'fabric';
import axios from 'axios';
import { IoArrowBack } from "react-icons/io5";
import { Spinner } from 'react-bootstrap';

const AddCaptionPage = () => {
    const location = useLocation();
    const [imageUrl, setImageUrl] = useState('');
    const [textColor, setTextColor] = useState('#000000');
    const [textSize, setTextSize] = useState(24);
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { imageId } = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchImage = async () => {
            try {
                const response = await axios.get(`https://api.unsplash.com/photos/${imageId}?client_id=-_7RBKFO3fNMrolJ-ePN-lHgFa0A3-J3EzOLFthPK2A`);
                setImageUrl(response.data.urls.full);
            } catch (error) {
                console.error('Error fetching image:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImage();
    }, [imageId]);

    useEffect(() => {
        if (imageUrl) {
            const canvas = new fabric.Canvas('canvas');
            canvasRef.current = canvas;

            const imgElement = new Image();
            imgElement.src = imageUrl;
            imgElement.crossOrigin = 'anonymous';

            imgElement.onload = () => {
                const fabricImage = new fabric.Image(imgElement, {
                    scaleX: 600 / imgElement.width,
                    scaleY: 400 / imgElement.height,
                    selectable: false,
                });
                canvas.set('backgroundImage', fabricImage);
                canvas.renderAll();
                logCanvasLayers(); // Log layers after image is loaded
            };

            return () => {
                canvas.dispose();
            };
        }
    }, [imageUrl]);

    const logCanvasLayers = () => {
        const canvas = canvasRef.current;
        const layers = canvas.getObjects().map((object, index) => ({
            index,
            type: object.type,
            left: object.left,
            top: object.top,
            width: object.width,
            height: object.height,
            fill: object.fill,
            text: object.text || null,
            fontSize: object.fontSize || null,
        }));
        console.log('Canvas Layers:', layers);
    };

    const addText = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const text = new fabric.Textbox('Your Caption', {
                left: 100,
                top: 100,
                fontSize: textSize,
                fill: textColor,
                editable: true,
            });
            canvas.add(text);
            canvas.setActiveObject(text);
            canvas.renderAll();
            logCanvasLayers(); // Log layers after adding text
        }
    };

    const addShape = (shapeType) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let shape;
        if (shapeType === 'circle') {
            shape = new fabric.Circle({
                radius: 50,
                fill: 'blue',
                left: 150,
                top: 150,
                selectable: true,
            });
        } else if (shapeType === 'rectangle') {
            shape = new fabric.Rect({
                width: 100,
                height: 50,
                fill: 'green',
                left: 150,
                top: 200,
                selectable: true,
            });
        } else if (shapeType === 'triangle') {
            shape = new fabric.Triangle({
                width: 100,
                height: 100,
                fill: 'purple',
                left: 150,
                top: 150,
                selectable: true,
            });
        }
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();
        logCanvasLayers(); // Log layers after adding shape
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            logCanvasLayers();
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1.0,
            });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'modified-image.png';
            link.click();
        }
    };

    return (
        <div className='search-page-main'>
            <div className='search-page-heading'>
                <IoArrowBack color='white' size={25} style={{ cursor: "pointer" }} onClick={() => navigate('/')} />
                <h1>Add Caption Page</h1>
            </div>

            <div className='search-page'>
                <div className='selected-image-main'>
                    <div className='selected-image'>
                        {loading ? (
                            <div className="loading-spinner">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        ) : (
                            <canvas id="canvas" width="600" height="400"></canvas>
                        )}
                    </div>
                    <div className='caption-main'>
                        <div className='caption-main-main'>
                            <div className='caption-main-text'>
                                <p>Add Caption</p>
                                <div className='caption-main-text-color'>
                                    <label htmlFor="">Color :</label>
                                    <input
                                        type="color"
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        title="Change Text Color"
                                    />
                                </div>
                                <div className='caption-main-text-color'>
                                    <label htmlFor="">Font Size :</label>
                                    <input
                                        type="number"
                                        value={textSize}
                                        onChange={(e) => setTextSize(parseInt(e.target.value))}
                                        min="12"
                                        max="72"
                                        title="Change Text Size"
                                    />
                                </div>
                                <button onClick={addText} className='caption-main-text-add'>Add Text</button>
                            </div>

                            <div className='caption-main-shapes-container'>
                                <h5>Shapes</h5>
                                <div className='caption-main-shapes'>
                                    <div className='caption-main-shapes-shape' onClick={() => addShape('circle')}>
                                        <h6>Circle</h6>
                                    </div>
                                    <div className='caption-main-shapes-shape' onClick={() => addShape('rectangle')}>
                                        <h6>Rectangle</h6>
                                    </div>
                                    <div className='caption-main-shapes-shape' onClick={() => addShape('triangle')}>
                                        <h6>Triangle</h6>
                                    </div>
                                </div>
                            </div>
                            <div className='caption-main-shapes-download' onClick={downloadImage}>
                                <p>Download Image</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCaptionPage;
