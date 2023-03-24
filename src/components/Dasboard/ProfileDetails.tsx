import React, {useState, useEffect} from "react";
import { 
    Address, 
    CopyIcon, 
    MyProfileContainer, 
    Name, 
    ProfilePhoto, 
    Row1, 
    Row1Column2, 
    Row2,
    ShortDesc,
} from "./profile.styled";
import { toast } from "react-toastify";
import { Roles, useMetamaskAuth } from "../../auth/authConfig";


const ProfileDetails = () => {
    const { isLoggedIn, profile } = useMetamaskAuth();
    const [fetching, setFetching] = useState(true);


    const CopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard !');
    }

    
    return (
        <>
            <MyProfileContainer>
                <Row1>
                    <ProfilePhoto src='/manufacturer.png'></ProfilePhoto>
                    <Row1Column2>
                        <Name>
                            {
                                profile ?
                                <>
                                    { profile.name }
                                </>
                                :
                                <>
                                    John Doe
                                </>
                            }
                        </Name>
                        <ShortDesc>
                            { profile ? profile.role : Roles.PRODUCER }
                        </ShortDesc>
                    </Row1Column2>
                </Row1>
                <Row2>
                    <Address>
                        {
                            profile ? profile.address : "0x0000000000000000000000000000000000000000"
                        }
                    </Address>
                    <CopyIcon src='icons/copyIcon.png' onClick={() => CopyToClipboard(profile?.address || "0x0000000000000000000000000000000000000000")}/>
                </Row2>
                <br/>
                { profile?.location }
            </MyProfileContainer>
        </>
    )
}

export default ProfileDetails;