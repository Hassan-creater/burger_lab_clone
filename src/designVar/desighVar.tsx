// design.ts
export const designVar = {
 
    // universal font family
    fontFamily : "poppins",

    // all card design
    Button: {
      backgroundColor: "bg-[#FABF2C]",
      
      borderRadius: "rounded-lg",             
      border: "border",                     
      borderColor: "border-[#FCD980]",      
      paddingX: "px-[0em]",
      width : "w-[85px]",
      height : "h-[33px]",
      paddingY: "py-[0em]",
      fontSize: "text-[14px]",                 
      fontWeight: "font-medium",
      color: "text-black",
      cursor: "cursor-pointer",
      transition: "transition-all duration-300 ease",
      hover: {
        backgroundColor: "hover:bg-[#FCD980]", 
        borderColor:      "hover:border-[#FCD980]",
        color:            "hover:text-black",
        translateX:       "",
      }
    },

    cardImage : {
        width : "w-[140px] custom-11:w-[180px] custom-lg:w-[150px] custom-923:w-[140px] custom-752:w-[230px] custom-mobile:w-[140px]",
        height : "h-[140px] ",
        borderRadius : "rounded-lg",
        border : "",
        borderColor : "",
        overflow : "overflow-hidden",
        flex : "flex justify-center items-center",
    },

    fontStyle :{
        fontSize : "text-[12px]",
        fontWeight : "font-medium",
        colorWhite : "text-white",
        color : "text-[rgb(0,0,0)]",

        colorBlack : "text-black",
        colorGray : "text-gray-600",
        cursor : "cursor-pointer",
        transition : "duration-300 ease",
        hover : {
            backgroundColor : "hover:bg-[#FCD980]",
            color : "hover:text-white",
        }
    },

    carHeading : {
        fontSize : "text-[16px]",
        fontWeight : "font-bold",
        colorOrange : "text-[#FABF2C]",
        colorBlack : "text-black",
        
       
    },

    productPrice : {
        backgroundColor : "bg-black",
        borderRadius : "rounded-lg",
        width : "min-w-[78px]",
        height : "h-[22px]",
        paddingX : "px-[]",
        paddingY : "py-[]",
        fontSize : "text-[12px]",
        fontWeight : "font-normal",
        color : "text-white",
        textSize : "text-[12px]"
    },

    cardDesign : {
        width : "w-[369.32px]  custom-md:w-[350px]  custom-11:w-[500px] custom-lg:w-[450px] custom-sm:w-[430px] custom-923:w-[350px] custom-752:w-[350px] ",
        height : "h-[164px]",
        minHeight : "min-h-[164px]",
        duration : "duration-300",
        backgroundColor : "bg-white",
        borderRadius : "rounded-lg",
        paddingX : "px-[0em]",
        paddingY : "py-[0em]",
        border : "border-[1px]",
        shadow : "shadow-sm",
        borderColor : "",    
        hover : {
            backgroundColor : "hover:bg-white",
            borderRadius : "hover:rounded-2xl",
            borderColor : "",
            shadow : "hover:shadow-lg",
            overflow : "hover:overflow-hidden",

        }
    },

    // all category headig and button design

    categoryHeading : {
        fontSize : "text-[22px]",
        fontWeight : "font-[600]",
        color : "text-black",
       
    },

    categoryButton : {
        activeBackgroundColor : "bg-[#FABF2C]",
        inactiveBackgroundColor : "bg-gray-300",
        borderRadius : "rounded-lg",
        paddingX : "px-[1em]",
        paddingY : "py-[0.5em]",
        fontSize : " text-[0.8em] sm:text-[0.9em]",
        fontWeight : "font-semibold",
        color : "text-black",
        cursor : "cursor-pointer",
        transition : "transition-all duration-500 ease",
        hover : {
                backgroundColor : "hover:bg-[#FABF2C]",
            borderRadius : "hover:rounded-2xl",
            color : "hover:text-white",
        }
    },

    // auth button design login/register button
    authButton : {
        backgroundColor : "bg-[#FABF2C]",
        borderRadius : "rounded-lg",
        paddingX : "px-[0.7em]",
        paddingY : "py-[0.5em]",
        fontSize : "text-base",
        fontWeight : "font-normal",
        color : "text-black",
        cursor : "cursor-pointer",
        transition : "transition-all duration-300 ease",
        hover : {
            backgroundColor : "hover:bg-[#FCD980]",
            borderRadius : "hover:rounded-2xl",
            color : "hover:text-white",
        }
    },



    


    // cart , login , register , checkout , location , favorite  , place order button design
    widthFullButton : {
        backgroundColor : "bg-[#FABF2C]",
        borderRadius : "rounded-lg",
        maxWidth : "max-w-[30%]",
        maxAddressWidth : "max-w-[13em]",
        paddingX : "px-[0.7em]",
        width : "w-full",
        paddingY : "py-[0.5em]",
        fontSize : "text-base",
        fontWeight : "font-normal",
        textSize : "text-xs sm:text-[1em]",
        color : "text-black",
        cursor : "cursor-pointer",
        transition : "transition-all duration-300 ease",
        hover : {
            backgroundColor : "hover:bg-[#FCD980]",
            borderRadius : "hover:rounded-2xl",
            color : "hover:text-white",
        },

        registerButtonLink : {
            backgroundColor : "bg-transparent",
            borderRadius : "rounded-lg",
            paddingX : "px-[0.7em]",
            paddingY : "py-[0.5em]",
            fontSize : "text-base",
            fontWeight : "font-normal",
            border : "border-[1px] border-[#FABF2C]",
            color : "text-black",
            cursor : "cursor-pointer",
            transition : "transition-all duration-300 ease",
            hover : {
                backgroundColor : "hover:bg-gray-100",
                borderRadius : "hover:rounded-2xl",
                color : "hover:text-black",
            }
        },

        registerButton : {
            backgroundColor : "bg-[#FABF2C]",
            borderRadius : "rounded-lg",
            paddingX : "px-[0.7em]",
            paddingY : "py-[0.5em]",
            fontSize : "text-base",
            fontWeight : "font-normal",
            color : "text-black",
            cursor : "cursor-pointer",
            transition : "transition-all duration-300 ease",
            hover : {
                backgroundColor : "hover:bg-[#FCD980]",
                borderRadius : "hover:rounded-2xl",
                color : "hover:text-white",
            }
        }
    },

    


  }
  