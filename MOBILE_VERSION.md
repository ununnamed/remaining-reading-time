


/* Make status bar visible on mobile version of Obsidian */
.is-mobile .app-container .status-bar {
    display: flex;
    position: relative;
    justify-content: center;
    padding: 0;
    background-color: transparent;
    color: #b28ecc;
pointer-events: none;
}

/* Make only Remaining Reading Time plugin visible on the status bar. Remove this 4 lines to make all plugins visible */
.is-mobile .app-container .status-bar > div:not(.plugin-remaining-reading-time) {
    display: none;
}
