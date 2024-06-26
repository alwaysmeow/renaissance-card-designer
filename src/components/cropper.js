import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import { useDispatch } from 'react-redux';

import 'react-image-crop/dist/ReactCrop.css';
import { setImage, setCropData } from '../store/cropSlice';

function Сropper() {
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [srcAspect, setSrcAspect] = useState()
    
    const dispatch = useDispatch();

    const onCropComplete = (crop, percentCrop) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            const cropData = {
                x: srcAspect.width * percentCrop.x / 100,
                y: srcAspect.height * percentCrop.y / 100,
                width: srcAspect.width * percentCrop.width / 100,
                height: srcAspect.height * percentCrop.height / 100
            }
            console.log(srcAspect);
            dispatch(setCropData(cropData));
        }
    };

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onSelectFile = (e) => {
        setCrop(null);
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setSrc(reader.result);
                dispatch(setImage(reader.result));
                const img = new Image();
                img.onload = () => {
                    setSrcAspect({
                        width: img.width,
                        height: img.height
                    });
                };
                img.src = reader.result;
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-5 mx-auto">
            <div className="flex items-center justify-center overflow-hidden w-96 h-96 bg-grey border-2 border-pink rounded-xl">
                {src && (
                    <div className='flex max-h-full'
                        style={{ aspectRatio: `${srcAspect}` }}
                    >
                        <ReactCrop
                            crop={crop}
                            aspect={85.6/54}
                            onComplete={onCropComplete}
                            onChange={onCropChange}
                        >
                            <img src = {src}/>
                        </ReactCrop>
                    </div>
                )}
            </div>
            <input className="color-pink" type="file" accept="image/*" onChange={onSelectFile} />
        </div>
    );
}

export default Сropper;