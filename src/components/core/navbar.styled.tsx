import styled from "styled-components"

export const NavbarContainer = styled.div`
    position: relative;
    width: 100%;
    height: 55px;
    background: #FFFFFF;
    border-bottom: 0.7px solid #E1E1E1;
    padding-left: 60px;
    display: flex;
    flex-direction: row;
    background-color: white;
    box-sizing: border-box;
    padding: 19px 60px;
    align-items: center;
    z-index: 10;
`

export const NavbarIcon = styled.img`
    width: 24px;
`

export const AppName = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    color: #404040;
    margin-left: 15px;
    cursor: pointer;
`

export const Login = styled.button`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #1977F2;
    cursor: pointer;
    margin-left: auto;
`

export const Signup = styled.button`
    display: flex;
    align-items: center;
    padding: 9px 24px;
    background: #1977F2;
    box-shadow: 0px 8px 24px rgba(241, 244, 251, 0.25);
    border-radius: 5px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #FFFFFF;
    margin-left: 65px;
    cursor: pointer;
`

export const Disconnect = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 24px;
    background: #1977F2;
    box-shadow: 0px 8px 24px rgba(241, 244, 251, 0.25);
    border-radius: 5px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #FFFFFF;
    margin-left: auto;
    cursor: pointer;
`