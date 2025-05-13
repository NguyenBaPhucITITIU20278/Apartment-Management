import { CrownOutlined, StarOutlined, TrophyOutlined } from '@ant-design/icons';

export const POSTING_PACKAGES = {
    STANDARD: {
        name: 'Standard',
        price: 120000,
        icon: <StarOutlined />,
        features: ['Images', 'Video'],
        code: 'STANDARD'
    },
    VIP1: {
        name: 'VIP 1',
        price: 150000,
        icon: <CrownOutlined />,
        features: ['Images', 'Video', '3D Model'],
        code: 'VIP1'
    },
    VIP2: {
        name: 'VIP 2',
        price: 200000,
        icon: <TrophyOutlined />,
        features: ['Images', 'Video', '3D Model', '360° View'],
        code: 'VIP2'
    }
};

export const getPackageForFeatures = (selectedFeatures) => {
    if (selectedFeatures.includes('360')) {
        return POSTING_PACKAGES.VIP2;
    } else if (selectedFeatures.includes('3D')) {
        return POSTING_PACKAGES.VIP1;
    } else if (selectedFeatures.includes('images') || selectedFeatures.includes('video')) {
        return POSTING_PACKAGES.STANDARD;
    }
    return POSTING_PACKAGES.STANDARD;
}; 