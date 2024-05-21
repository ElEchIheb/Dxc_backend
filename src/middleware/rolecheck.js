
const isSuperAdmin = (req,res,next) =>{
    
            if (req.userRole ==="superadmin"){
                
                next()
                
            }
            else{    
               res.status(403).json({
                message:"require superAdmin Role "
               });
            }
        ;
}

const isAdminOrSuperAdminOrManager = (req,res,next)=>{
    if (req.userRole ==="superadmin"||req.userRole ==="admin"||req.userRole ==="manager"){
                
        next()
        
    }
    else{    
       res.status(403).json({
        message:"require superAdmin , admin or manager Role "
       });
    }
;
}
const isAdminOrSuperAdmin = (req,res,next)=>{
    if (req.userRole ==="superadmin"||req.userRole ==="admin"){
                
        next()
        
    }
    else{    
       res.status(403).json({
        message:"require superAdmin or admin Role "
       });
    }
;
}

const isAdmin=(req,res,next)=>{
if (req.userRole==="admin"){
    next()
}
else res.status(403).json({
    messsage:"require Admin Role"
})
}

module.exports={
    isSuperAdmin,
    isAdminOrSuperAdminOrManager,
    isAdmin,
    isAdminOrSuperAdmin 
}



