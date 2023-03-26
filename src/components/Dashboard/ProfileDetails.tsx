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
import Loader from "../core/Loader";


const ProfileDetails = () => {
    const { isProcessingLogin, profile } = useMetamaskAuth();

    console.log("Profile", profile);
    
    const CopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard !');
    }

    if(isProcessingLogin || !profile)
        return <Loader size={10} />
    
    const profilePic = profile.role == Roles.PRODUCER ? '/icons/manufacturer.png' : '/icons/warehouse.png';

    return (
        <>
            <MyProfileContainer>
                <Row1>
                    <ProfilePhoto src={profilePic} />
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
                            profile ? profile.id : "0x0000000000000000000000000000000000000000"
                        }
                    </Address>
                    <CopyIcon src='icons/copyIcon.png' onClick={() => CopyToClipboard(profile?.id || "0x0000000000000000000000000000000000000000")}/>
                </Row2>
                <br/>
                { profile?.location }
            </MyProfileContainer>
        </>
    )
}

export default ProfileDetails;