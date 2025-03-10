declare module 'react-360-view' {
    import React from 'react';

    interface React360ViewerProps {
      amount: number;
      imagePath: string;
      fileName: string;
      autoplay?: boolean;
      loop?: boolean;
    }

    export class React360Viewer extends React.Component<React360ViewerProps> {}
  }