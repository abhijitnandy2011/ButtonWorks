// libButtonWorks
// Copyright Abhijit Nandy, 2022

// Note: HTAs run in IE7 compatibility mode by default

function createTaskChild(task) 
{  
    var btn = document.createElement("button");
    btn.innerHTML = task.name;
    if(task.desc) {
        btn.title = task.desc
    }            
    btn.taskType = task.type
    btn.taskPath = task.path
    btn.onclick = function () {               
        //alert("taskType:" + this.id + this.taskType)
        WshShell = new ActiveXObject("WScript.Shell");
        if(this.taskType == "bat") {
            WshShell.Run("cmd /k \"" + this.taskPath + "& exit\"", 1, false);
        }
        else if(this.taskType == "start") {
            WshShell.Run("cmd /k \"start " + this.taskPath + " & exit\"", 1, false);
        }
        else if(this.taskType == "explorer") {
            WshShell.Run("cmd /k start \"\" \"" + this.taskPath + "\" & exit", 1, false);
        }
        else if(this.taskType == "cmd") {
            alert("TODO")
        }
        else if(this.taskType == "py") {
            alert("TODO")
        }
    };            
    return btn;
}


function createMainLayoutFromJSON(objTasks) {
    var tblMainLayout = document.getElementById(objTasks.settings.mainLayoutName);
    
    for (var lr = 0; lr < objTasks.layout.length; ++lr) {
        var mainTR = tblMainLayout.insertRow();
        var arrLayRowJSON = objTasks.layout[lr];        
        for (var lc = 0; lc < arrLayRowJSON.length; ++lc) {
            var mainTD = mainTR.insertCell();
            var strGrpName = arrLayRowJSON[lc];
            var arrGrpJSON = objTasks.groups[strGrpName];
            if (arrGrpJSON == undefined) {
                alert("The group '" + strGrpName + "' was not declared in the 'groups' object in JSON: ");
                continue;
            }
            // Create group table child in this layout for now till info available 
            // in grp for putting in other existing table/div
            var grpTable = document.createElement("table");            
            for (var gr = 0; gr < arrGrpJSON.length; ++gr) {
                var grpTR = grpTable.insertRow();                
                var arrGrpRowJSON = arrGrpJSON[gr];
                for (var gc = 0; gc < arrGrpRowJSON.length; ++gc) {
                    var grpTD = grpTR.insertCell();
                    var taskId = arrGrpRowJSON[gc];                    
                    var objTask = objTasks.tasks[taskId];
                    if (objTask == undefined) {
                        continue;
                    }
                    // Create the task child                    
                    var btn = createTaskChild(objTask);
                    //grpTD.style.border = '1px solid black';
                    grpTD.className += "grpTD";
                    grpTD.appendChild(btn);
                }                
            }
            
            //grpTable.setAttribute("class", "tb");
            grpTable.className += "tb";
            var grpTH = grpTable.createTHead();            
            var grpTHRow = grpTH.insertRow(0);
            var grpTHCell = grpTHRow.insertCell(0);
            grpTHCell.innerHTML = "<center><B>" + strGrpName + "</B></center>";
            grpTHCell.className += "grpTH";
            mainTD.className += "mainTD";
            mainTD.appendChild(grpTable);
        }        
    }    
}

function loadTasks(strTasksFileName) {      
    try {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var ForReading = 1;
        var f = fso.OpenTextFile(strTasksFileName, ForReading);
        var text = f.ReadAll();
        var objTasks = JSON.parse(text);
        createMainLayoutFromJSON(objTasks);
    }
    catch(err) {
        alert(err.name + ": " + err.fileName + ": Line " + err.lineNumber + ": Column: " + err.columnNumber + "\n" + err.message + "\nTrace:" + err.stack);        
    }
}
