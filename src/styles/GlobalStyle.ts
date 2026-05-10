import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    /* CSS Reset */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        // 💡 정의하신 테마 구조 적용
        background-color: ${({ theme }) => theme.colors.background.default};
        color: ${({ theme }) => theme.colors.text.default};
        font-family: 'Pretendard Variable', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    button {
        cursor: pointer;
        border: none;
        background: none;
        font-family: inherit;
    }

    input, textarea {
        font-family: inherit;
    }
`;
