import React, { useState } from 'react';
import getFormValues from '../../libs/utils/get-form-values.utils';
import AlertAtoms from '../atoms/alert/alert.atoms';
import ButtonAtoms from '../atoms/button/button.atoms';
import FormAtoms from '../atoms/form/form.atoms';
import InputFormAtoms from '../atoms/inputs/input-form/input-form.atoms';
import checkEmail from '../../libs/utils/check-email.utils.js'
import styles from './register-form.module.css'

const RegisterForm = () => 
{
    const [message, setMessage] = useState('');

    const signUp = async(e) => {
        e.preventDefault()
        
        try 
        {
            let form = e.target;
            let deleteEmpty = true
            let data = getFormValues({form,deleteEmpty})
            
            
            
            if (data)
            {
                const { registerUserName, registerUserEmail, registerUserPassword, registerUserRepeatPassword, ...rest } = data;

                if (!registerUserName || !registerUserEmail || !registerUserPassword || !registerUserRepeatPassword) { 
                    return setMessage({alert:'danger',msg:'Complete all fields!', fields:['registerUserName','registerUserEmail','registerUserPassword']})
                } 
    
                if (Object.keys(rest).length !== 0) { 
                    return setMessage({alert:'danger',msg:'Error fields!'})
                }
    
                if (!checkEmail(registerUserEmail))
                {
                    return setMessage({alert:'danger',msg:'Error email!', fields:['registerUserEmail']})
                }
    
                if (registerUserPassword !== registerUserRepeatPassword) { 
                    return setMessage({alert:'danger',msg:'Error repeat password!', fields:['registerUserPassword']})
                }
    
                delete data['registerUserRepeatPassword']; 

                
                
                const userRegister = await window.api.userRegister(data)
                
               
                
                if (userRegister && typeof userRegister === 'object')
                {
                    
                    
                    setMessage(userRegister)
                    return 'OK AQUI VA EL HASH'
                }
                
                return setMessage({alert:'danger',msg:userRegister})
            }
            return setMessage({alert:'danger',msg:'Error register!'})
        }
        catch(e)
        {
            
            return setMessage({alert:'danger',msg:'Error register!', fields:['registerUserName','registerUserEmail','registerUserPassword']})
        }
    }
    return(
        <FormAtoms onSubmit={(e) => signUp(e)}>
            <InputFormAtoms type={`text`} placeholder={`UserName`} name={`registerUserName`} valDefault='Nuevo' style={{borderColor: message.fields && message.fields.includes('registerUserName') ? 'var(--color_danger)' : '', color: message.fields && message.fields.includes('registerUserName') ? 'var(--color_danger)' : '' }}/>
            <InputFormAtoms type={`text`} placeholder={`Email`} name={`registerUserEmail`} valDefault='Nuevo@gmail.com' style={{borderColor: message.fields && message.fields.includes('registerUserEmail') ? 'var(--color_danger)' : '', color: message.fields && message.fields.includes('registerUserEmail') ? 'var(--color_danger)' : '' }}/>
            <InputFormAtoms type={`password`} placeholder={`Password`} name={`registerUserPassword`} valDefault='12345678' style={{borderColor: message.fields && message.fields.includes('registerUserPassword') ? 'var(--color_danger)' : '', color: message.fields && message.fields.includes('registerUserPassword') ? 'var(--color_danger)' : '' }}/>
            <InputFormAtoms type={`password`} placeholder={`Repeat password`} name={`registerUserRepeatPassword`} valDefault='12345678' style={{borderColor: message.fields && message.fields.includes('registerUserPassword') ? 'var(--color_danger)' : '', color: message.fields && message.fields.includes('registerUserPassword') ? 'var(--color_danger)' : '' }}/>
            <ButtonAtoms type={`submit`} btnStyle={{btnType:'secondary_r',txtAlgn:'center', btnRadius:true}}>
                Sign Up
            </ButtonAtoms>
            {message && 
                <AlertAtoms alertStyle={{alertType:message.alert,txtAlgn:'left', alertRadius:true, alertShadow:true}}>
                    {message.msg}
                </AlertAtoms>
            }
        </FormAtoms>
    )

}
export default RegisterForm