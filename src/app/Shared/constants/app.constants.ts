

export const VIDEO_CATEGORIES = [
    'Action',
    'Drama',
    'Comedy',
    'Sci-Fi',
    'Thriller',
    'Documentary',
    'Horror',
    'Romance',
    'Adventure',
    'Fantasy',
    'Animation',
    'Crime',
    'Mystery',
    'Biography',
    'History',
    'War',
    'Western',
    'Musical',
    'Sport',
    'Family'
];

export const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

export const DIALOG_CONFIG = {
    VIDEO_PLAYER: {
        with: '100',
        height: '100vh',
        maxwidth: '100vw',
        maxheight: '100vh',
        panelClass: 'video-player-dialog',
        hasBackdrop: true,
        disableClose: false
    },
    CHANGE_PASSWORD: {
        width: '600px',
        maxwidth: '90vw',
        panelClass: 'user-dialog',
        hasBackdrop: true,
        disableClose: false
    },
    CONFIRM: {
        width: '500px',
        panelClass: 'custom-dialog-container',
        hasBackdrop: true,
        disableClose: false
    },
    MANAGE_USER: {
        width: '600px',
        maxwidth: '90vw',
        panelClass: 'user-dialog',
        hasBackdrop: true,
        disableClose: false
    },
    VIDEO_FROM: {
        width: '95vw',
        maxwidth: '1400px',
        height: 'auto',
        maxheight: '95vh',
        panelClass: 'video-form-dialog',
        hasBackdrop: true,
        disableClose: false
    }
}