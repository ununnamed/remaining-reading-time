How to make remaining reading time appear on mobile version:
<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/bcd56e37-2bf8-42b7-b742-726ed34f19c5" />

1. Open Settings => Appearance => CSS snippets. Turn them ON.
<img width="3240" height="2369" alt="image" src="https://github.com/user-attachments/assets/676c75b0-fc3a-405b-85d3-028ada2d3750" />
Look where snippets are located at.

2. Go to where snippets are located. You'd have to install File Manager and turn ON showing hidden objects.
   ![1970-01-01 01-00-00_1761051240](https://github.com/user-attachments/assets/e59afb83-f033-4247-9e40-901d3b564dce)
   ![1970-01-01 01-00-00_1761051226](https://github.com/user-attachments/assets/6143b772-448d-48c9-a44d-7f4b8101f3fe)
![1970-01-01 01-00-00_1761051229](https://github.com/user-attachments/assets/1296b519-5565-4262-91a3-9602e8007fbe)

4. You don't have snippets.css, create it
![1970-01-01 01-00-00_1761051206](https://github.com/user-attachments/assets/c520a5f2-bcc3-41b0-9db4-c43b8af4cf08)

5. Paste this code inside snippets.css and save
```progressbar
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

/* Make only Remaining Reading Time plugin visible on the status bar. Remove this and everything below to make all plugins visible */
.is-mobile .app-container .status-bar > div:not(.plugin-remaining-reading-time) {
    display: none;
}
```
![1970-01-01 01-00-00_1761051210](https://github.com/user-attachments/assets/8944fd25-566e-466c-b6fb-7521af578695)

6. Relaunch Obsidian and you'll see the timer in editing mode. 
