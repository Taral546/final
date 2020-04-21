function newuser()
{
    let name_field = document.getElementById("name");
    let email_field = document.getElementById("email");
    let phone_field = document.getElementById("phone");
    let password_field = document.getElementById("password");
    let confirm_password_field = document.getElementById("confirm_password");
    let ownership_field = document.getElementById("ownership");

    let name = name_field.value;
    let email = email_field.value;
    let phone = phone_field.value;
    let password = password_field.value;
    let confirm_password = confirm_password_field.value;
    let ownership = ownership_field.value;

    if(name.length === 0 || email.length === 0 || password.length === 0 || confirm_password.length === 0 || ownership.length === 0) 
    {
        alert("Please Fill the required fields");
    }
    else
    {
        if(password === confirm_password)
        {
            let existed_user = false;
            list_of_users.forEach(row=>{
                if(row.user_email === email)
                {
                    existed_user = true;
                    return;
                }
            });
            if(existed_user)
            {
                alert("Already Existed");
            }
            else
            {
                current_user = {
                    user_name : name,
                    user_email : email,
                    user_phone : phone,
                    user_password : password,
                    user_ownership: ownership
                };
                list_of_users.push(current_user);
                localStorage.setItem("list_of_users",JSON.stringify(list_of_users));
                alert("Successfully Signed Up!");
            }
            window.location = "login.html";
        }
        else
        {
            alert("PLease Try Again!");
            password_field.value = null;
            password_field.focus();
            confirm_password_field.value = null;
        }
    }     
}



function loginUser()
{
    let correct_credentials = false;
    let ownership_type ="";
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    list_of_users.forEach(user => {
        if(user.user_email === email && user.user_password ===password)
        {
            sessionStorage.setItem("isLoggedIn","true");
            sessionStorage.setItem("loggedInUsername",email);
            ownership_type = user.user_ownership;
            correct_credentials = true;
            return;
        }
    });

    if(correct_credentials===true && ownership_type==="coworker")
    {
        window.location = "co-worker.html";
    }
    else if(correct_credentials===true && ownership_type==="owner")
    {
        window.location = "owner.html";
    }
    else
    {
        alert("Please Try Again!");
        document.getElementById("email").value = null;
        document.getElementById("password").value = null;
        document.getElementById("email").focus();
    }

}

function add_new_user()
{
    let title_field = document.getElementById("title");
    let description_field = document.getElementById("description");
    let type_field = document.getElementById("type");

    let title = title_field.value;
    let description = description_field.value;
    let type = type_field.value;

    if(title.length>0 && description.length>0 && type.length>0)
    {
        let existed_title = false;
        list_of_properties_workspaces.forEach(row=>{
            if(row.post_title === title)
            {
                existed_title = true;
                return;
            }
        });

        if(existed_title)
        {
            alert("similar  title");
            title_field.value= "";
            title_field.focus();
        }
        else
        {
            list_of_properties_workspaces.push({
                post_user_email: sessionStorage.getItem("loggedInUsername"),
                post_title: title,
                post_description: description,
                post_type : type,
            });
    
            localStorage.setItem("list_of_properties_workspaces", JSON.stringify(list_of_properties_workspaces));
    
            alert("Data Added");
            window.location = "owner.html";
        }
    }
    else
    {
        alert("All Fields Required");
        title_field.focus();
    }

}

function show_data()
{
    let data_info = "";

    if(list_of_properties_workspaces.length>0)
    {
        data_info += "<tr> <th>Title</th> <th>Description</th> <th>Type</th> <th>Delete</th> </tr>";
        let temp_len = 0;
        list_of_properties_workspaces.forEach(row => {
            if(row.post_user_email === sessionStorage.getItem("loggedInUsername"))
            {
                temp_len++;
                data_info+= "<tr> <td>"+row.post_title+"</td> <td>"+row.post_description+"</td><td>"+row.post_type+"</td> <td> <a href=\"delete.html?email="+row.post_user_email+"&title="+row.post_title+"\">Delete</a> </td></tr>";
            }
        });

        if(temp_len<=0)
        {
            data_info = '<tr> <td style="font-size:30px"> No Properties/Workspaces Added for Current User </td> </tr>';    
        }
    }
    else
    {
        data_info = '<tr> <td style="font-size:30px"> No Properties/Workspaces Added </td> </tr>';
    }

    document.getElementById("list_of_properties_workspaces").innerHTML = data_info;    
}




let list_of_users = [];
let list_of_properties_workspaces = [];
if(localStorage.getItem("list_of_users"))
{
    list_of_users = JSON.parse(localStorage.getItem("list_of_users"));
}

if(localStorage.getItem("list_of_properties_workspaces"))
{
    list_of_properties_workspaces = JSON.parse(localStorage.getItem("list_of_properties_workspaces"));
}



if(sessionStorage.getItem("isLoggedIn") === "true" && (current_page == "login.html" || current_page ==="owner.html" || current_page === "add.html"  || current_page === "viewpost.html"))
{
    document.getElementById("signout").style.display = "block";
    let loggedInUserEmail = sessionStorage.getItem("loggedInUsername");
    list_of_users.forEach(user => {
        if(user.user_email === loggedInUserEmail)
        {
            document.getElementById("username").innerHTML = "Welcome "+user.user_name;
            document.getElementById("loginSignupMenu").style.display = "none";
            return;
        }
    });
}
else
{
    document.getElementById("loginSignupMenu").style.display = "inline";
    document.getElementById("signout").style.display = "none";
}

function workspace_Table()
{
    let data_info = "";

    if(list_of_properties_workspaces.length>0)
    {
        data_info += "<tr> <th>Title</th> <th>Description</th> <th>Type</th>";
        list_of_properties_workspaces.forEach(row => {
            data_info+= "<tr> <td>"+row.post_title+"</td> <td>"+row.post_description+"</td><td>"+row.post_type+"</td>";
        });
    }
    else
    {
        data_info = '<tr> <td style="font-size:30px"> No Properties/Workspaces Added </td> </tr>';
    }

    document.getElementById("propertiesTable").innerHTML = data_info;  
    
}




function signOut()
{
    if(sessionStorage.getItem("isLoggedIn") === "true" && sessionStorage.getItem("loggedInUsername").length > 0)
    {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("loggedInUsername");
        window.location = "login.html";
        alert("Logged Out!");
    }
}