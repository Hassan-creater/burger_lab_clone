// design.ts
export const designVar = {
 
    // universal font family
    fontFamily : "sans-serif",

    // all card design
    Button: {
      backgroundColor: "bg-[#FABF2C]",
      borderRadius: "rounded-lg",             // <-- use a Tailwind class instead of "10px"
      border: "border",                       // <-- Tailwind class
      borderColor: "border-[#FCD980]",        // <-- Tailwind class
      paddingX: "px-[0.7em]",
      paddingY: "py-[0.5em]",
      fontSize: "text-base",                  // <-- Tailwind size utilities
      fontWeight: "font-bold",
      color: "text-black",
      cursor: "cursor-pointer",
      transition: "transition-all duration-300 ease",
      hover: {
        backgroundColor: "hover:bg-[#FCD980]",  // <-- hover: prefix
        borderColor:      "hover:border-[#FCD980]",
        color:            "hover:text-black",
        translateX:       "group-hover:translate-x-1",
      }
    },

    fontStyle :{
        fontSize : "text-[0.8em]",
        fontWeight : "font-medium",
        colorWhite : "text-white",
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
        fontSize : "text-[1.4em]",
        fontWeight : "font-bold",
        colorOrange : "text-orange-500",
        colorBlack : "text-black",
       
    },

    productPrice : {
        backgroundColor : "bg-black",
        borderRadius : "rounded-lg",
        paddingX : "px-[0.9em]",
        paddingY : "py-[0.3em]",
        fontSize : "text-[1.2em]",
        fontWeight : "font-bold",
        color : "text-white",
        textSize : "text-[0.9em]"
    },

    cardDesign : {
        width : "w-[29em]",
        height : "h-[13em]",
        minHeight : "min-h-[13em]",
        duration : "duration-300",
        backgroundColor : "bg-white",
        borderRadius : "rounded-lg",
        paddingX : "px-[0.5em]",
        paddingY : "py-[0.5em]",
        border : "border-[1px]",
        borderColor : "border-orange-500",    
        hover : {
            backgroundColor : "hover:bg-gray-100",
            borderRadius : "hover:rounded-2xl",
            borderColor : "hover:border-orange-500",
            shadow : "hover:shadow-xl",
            overflow : "hover:overflow-hidden",

        }
    },

    // all category headig and button design

    categoryHeading : {
        fontSize : "text-[1.5em]",
        fontWeight : "font-bold",
        color : "text-black",
       
    },

    categoryButton : {
        activeBackgroundColor : "bg-[#FABF2C]",
        inactiveBackgroundColor : "bg-gray-300",
        borderRadius : "rounded-lg",
        paddingX : "px-[1.3em]",
        paddingY : "py-[0.6em]",
        fontSize : "text-[1em]",
        fontWeight : "font-bold",
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
        textSize : "text-[1em]",
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
  