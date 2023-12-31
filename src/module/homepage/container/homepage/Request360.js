import React, { useEffect ,cloneElement} from "react";
import { styled } from "styled-components";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import axios from "axios";
import Autocomplete from '@mui/joy/Autocomplete';
import AutocompleteOption from '@mui/joy/AutocompleteOption';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMutation } from "react-query";
import { formSubmit } from "../../../../request-API/postRequest";
import ThankyouScreen from "../../../../core/common/ThankyouScreen";

export default function Request360Form({setOpen}) {
    const [country, setcountry] = React.useState(null);
    const [governorate, setGovernorate] = React.useState(false);
    const [service, setService] = React.useState(null);
    const [otherService, setOtherService] = React.useState(null);
    const [addField, setAddField] = React.useState(0);
    const [isShowThanku, setIsShowThanku] = React.useState(false);



  const {mutate}=useMutation("postForm",formSubmit,{
    onSuccess:()=>{
      // setOpen(false)
      toast("Thanks for submitting.");
      toast("Our Team will connect to you very soon ");
      setIsShowThanku(true)

    },
    onError:(err)=>{
      toast(err.response.data.message)
    }
  })

  const submitHandler =async (e) => {
    e.preventDefault();
    try {

      const payload = new FormData(e.target);
      mutate(payload)

      
    } catch (error) {
      alert(error.response.data.name);
    }
  };
    useEffect(()=>{
        if(country?.label==="Oman"){
            setGovernorate(true)
        }else{
            setGovernorate(false)
        }
    },[country])

    useEffect(()=>{
        if(service==="Others"){
            setOtherService(true)
        }else{
            setOtherService(false)
        }
    },[service])

  return (
    <>
    {
      isShowThanku?
      <>
        <ThankyouScreen close={setOpen}/>
      </>
      :
      <>
      <Wrapper>
        <FormControl>
          <Typography sx={{fontSize:"22px",marginBottom:"40px",marginTop:"-40px"}}>
        Request 360 Site Visit
          </Typography>
          <form onSubmit={submitHandler}>
            <div className="row">
              <div>
                <FormLabel>Name </FormLabel>
                <Input sx={{"width": "300px"}} name="name" placeholder="Name"/>
                {/* <FormHelperText>This is a helper text.</FormHelperText> */}
              </div>
              <div>
                <FormLabel>Company Name (if applicable) </FormLabel>
                <Input name="company_name" sx={{'width':"300px"}} placeholder="Name" />
                {/* <FormHelperText>This is a helper text.</FormHelperText> */}
              </div>
            </div>

            <div className="row">
              <div>
                <FormLabel>Phone number</FormLabel>
                <Input name="number" sx={{'width':"300px"}} placeholder="Number" />
                {/* <FormHelperText>This is a helper text.</FormHelperText> */}
              </div>
              <div>
                <FormLabel>Job Title (if applicable)</FormLabel>
                <Input name="job_title" sx={{'width':"300px"}} placeholder="Title" />
                {/* <FormHelperText>This is a helper text.</FormHelperText> */}
              </div>
            </div>
             <div className="row" style={{'flexDirection':'column'}}>
            <FormLabel >Company Size (if applicable)</FormLabel>
                <CompanySize/>
            </div>


            <div className="row" style={{'flexDirection':'column'}} >
            <FormLabel >Select Your Country</FormLabel>
                <CountrySelect value={country} setValue={setcountry}/>
            </div>
            {governorate && <div className="row"  style={{'flexDirection':'column'}}>
            <FormLabel >Select Your Governorate</FormLabel>
                <Governorate/>
            </div>}

            <div className="row"  style={{'flexDirection':'column'}}>
            <FormLabel >Select your sector (if applicable)</FormLabel>
                <Services service={service} setService={setService}/>
            </div>

            {otherService && <div className="row">
                <div>

            <FormLabel>Specify Other Service</FormLabel>
            <Input name="other_service_brief" sx={{'width':"300px"}} placeholder="Other" />
                </div>
            </div>}

            <div className="row">
            <div>
                <FormLabel>Site estimated size (m2) </FormLabel>
                     <Input name="estimated_size[]" sx={{'width':"300px"}} placeholder="Size" />
                     {new Array(addField).fill("").map((_,index)=>{
                         return(
                            cloneElement(
                                <div style={{paddingTop:12,display:"flex",columnGap:10}}>
                                    <Input name={`estimated_size[]`} sx={{'width':"300px"}} placeholder="Size" />
                                    
                                    <DeleteOutlineIcon sx={{color:"red"}} onClick={(e) =>
                                            e.target.parentNode.remove()
                                          }/>
                                </div>
                            )

                        )
                     })}
                     <button type="button" className="primary-btn" style={{fontSize:12}} onClick={()=>setAddField(i=>i+1)}>Add another site</button>

                {/* <FormHelperText>This is a helper text.</FormHelperText> */}
              </div>
            </div>

            {/* <div className="row" style={{'flexDirection':'column'}}>
                <FormLabel>Email</FormLabel>
                <Input name="Email" sx={{'width':"100%"}} placeholder="Email" />
            </div> */}

            <button className="primary-btn">submit</button>
          </form>
        </FormControl>
      </Wrapper>
      </>
    }
    
    </>
  );
}

// company component start
const companySizeList=["1-10 employees","11-50 employees","51-200 employees","201-500 employees","501-1,000 employees","1,001-2,500 employees","2,501+ employees"
  ]
const CompanySize=()=>{
    return(
        <Autocomplete
        placeholder="Company size"
        options={companySizeList}
        sx={{ width: "100%" }}
        name="company_size"
        />
        )
    }
// company component end

// governate component start
const governorateList=['Muscat', 'Dhofar', 'Musandam',' Al Buraimi', 'Al Dakhiliyah', 'Al Batinah North', 'Al Batinah South', 'Al Sharqiyah North', 'Al Sharqiyah South', 'Al Dhahirah', 'Al Wusta']
const Governorate=()=>{
    return(
        <Autocomplete
        name="governorate"
        placeholder="Governorate"
        options={governorateList}
        sx={{ width: "100%" }}
        />
        )
    }
// governate component end

// service component start
const serviceList=[
  "Industrial plants","Real Estate agency", "Hotels","Wedding & Meeting Halls","Car showrooms ","Universities & Colleges","Private Schools","Malls & Shopping Centers","Gyms & Fitness Centers","Restaurants & Coffee Shops","Real Estate (Individual) ","Government entity","Others"
]
    
const Services=({service,setService})=>{
    return(
        <Autocomplete
        placeholder="Service"
        name="service"
        value={service}
        onChange={(event, newValue) => {
            setService(newValue);
          }}
        options={serviceList}
        sx={{ width: "100%" }}
        />
        )
    }
// service component end



// country component start
const countries = [
    { code: 'AE',label: 'United Arab Emirates',phone: '971'},
    { code: 'OM', label: 'Oman', phone: '968' },
    { code: 'SA', label: 'Saudi Arabia', phone: '966' },
    { code: 'QA', label: 'Qatar', phone: '974' },
    { code: 'KW', label: 'Kuwait', phone: '965' },
    { code: 'BH', label: 'Bahrain', phone: '973' },


  ];

 function CountrySelect({value,setValue}) {
  return (
    <Autocomplete
      id="country-select-demo"
      placeholder="Choose a country"
      slotProps={{
        input: {
          autoComplete: 'new-password', // disable autocomplete and autofill
        },
      }}
      sx={{ width: "100%" }}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      name="country"
      options={countries}
      autoHighlight
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => (
        <AutocompleteOption {...props}>
          <ListItemDecorator>
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              alt=""
            />
          </ListItemDecorator>
          <ListItemContent sx={{ fontSize: 'sm' }}>
            {option.label}
            <Typography level="body3">
              ({option.code}) +{option.phone}
            </Typography>
          </ListItemContent>
        </AutocompleteOption>
      )}
    />
  );
}
// country component end



const Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin: auto;
  .row {
    display: flex;
    column-gap: 10px;
    margin-bottom: 28px;
  }
  .sub-row{
    gap: 80px;
    display: flex;
    margin-left: 40px;
  }
  .primary-btn {
    font-size: 16px;
    font-weight: 400;
    padding: 8px 22px;
    border-radius: 10px;
  }
  @media screen and (max-width:768px) {
  
  .row{
    flex-direction: column !important;
    &>div{
      width: 100% !important;
    }
  }
}
`;