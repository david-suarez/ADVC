'use strict';
advcApp.factory('reportSrv', ['configSrv', function(configSrv){
    var imageConfig = null;
    configSrv.getData(function(data){
        imageConfig = data.Icon.Image;
    });
    return {
        generateReportOfUsers: function(table){
            var imgData = imageConfig;
            var doc = new jsPDF({},'pt','legal',true);
            doc.addImage(imgData, 'JPEG', 50, 10, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(195, 53, 'ASOCIACIÓN DEPARTAMENTAL');
            doc.text(210, 78, 'DE VOLEIBOL COCHABAMBA');

            doc.setFont("helvetica");
            doc.setFontSize(16);
            doc.setFontType("bold");
            doc.text(250, 135, 'LISTA DE USUARIOS');

            doc.setFontType("normal");
            doc.setFontSize(12);
            doc.cellInitialize();
            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Nombre de Usuario"){
                        doc.cell(50,155,140,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Nombre Completo"){
                        doc.cell(50,155,210,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Rol de Usuario"){
                        doc.cell(50,155,143,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else{
                        doc.cell(50,155,35,29,cell,i);
                        doc.setFillColor(221,221,221);
                    }

                });

            });
            //doc.save('Lista Usuarios.pdf');
            doc.output("dataurlnewwindow");
        },

        generateReportOfClubs: function(table){
            var imgData = imageConfig;
            var doc = new jsPDF({},'pt','legal',true);
            doc.addImage(imgData, 'JPEG', 70, 0, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22);
            doc.setFontType("bold");
            doc.text(195, 53, 'ASOCIACIÓN DEPARTAMENTAL');
            doc.text(210, 78, 'DE VOLEIBOL COCHABAMBA');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(255, 125, 'LISTA DE CLUBS');

            doc.setFontType("normal");
            doc.setFontSize(12); //aumenta tamanio de la letra
            doc.cellInitialize();
            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Nombre Club"){
                        doc.cell(70,160,150,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Delegado"){
                        doc.cell(70,160,210,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Fundacion"){
                        doc.cell(70,160,80,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else{
                        doc.cell(70,160,35,29,cell,i);
                        doc.setFillColor(221,221,221);
                    }

                });

            });
            //doc.save('Lista Clubs.pdf');
            doc.output("dataurlnewwindow");
        },

        generateReportMajorCategory: function(table, team){
            var imgData = imageConfig;
            var club = team.club;
            var teams = team.name;
            var category = team.category;
            var division = team.division ? team.division.name : '';
            var branch = team.branch;
            var nameChampionship = team.nameChampionship;
            var today = new Date();
            var todayYear = today.getFullYear();

            var doc = new jsPDF({},'pt','legal',true);
            doc.addImage(imgData, 'JPEG', 70, 10, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(195, 53, 'ASOCIACIÓN DEPARTAMENTAL');
            doc.text(210, 78, 'DE VOLEIBOL COCHABAMBA');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(260, 110, 'Formulario:02');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(70, 130, 'Club:' +" "+ club);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(70, 160, 'Categoría:' +" "+ category);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(350, 160, 'División:' +" "+ division);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(70, 190, 'Rama:' +" "+ branch);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(240, 190, 'Campeonato:' +" "+ nameChampionship);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(450, 190, 'Gestión:' +" "+ todayYear);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(280, 225, 'RELACIÓN');
            doc.text(230, 255, 'NOMINAL DE JUGADORES');

            //doc.setFontType("bold");
            doc.setFontSize(10); //aumenta tamanio de la letra
            doc.cellInitialize();
            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Nombre Completo"){
                        doc.cell(70,285,190,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Fecha de Nacimiento"){
                        doc.cell(70,285,90,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Club Origen"){
                        doc.cell(70,285,80,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Registro"){
                        doc.cell(70,285,105,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else{
                        doc.cell(70,285,27,29,cell,i);
                        doc.setFillColor(221,221,221);
                    }

                });

            });
            //doc.save('Reporte Equipos Mayores.pdf');
            doc.output("dataurlnewwindow");
        },

        generateReportMinorCategory: function(table, team){
            var imgData = imageConfig;
            var club = team.club;
            var teams = team.name;
            var category = team.category;
            var division = team.division ? team.division.name : '';
            var branch = team.branch;
            var nameChampionship = team.nameChampionship;
            var today = new Date();
            var todayYear = today.getFullYear();

            var doc = new jsPDF({},'pt','legal',true);
            doc.addImage(imgData, 'JPEG', 35, 10, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(195, 53, 'ASOCIACIÓN DEPARTAMENTAL');
            doc.text(210, 78, 'DE VOLEIBOL COCHABAMBA');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 110, 'Formulario:02');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(35, 155, 'Club:' +" "+ club);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(35, 190, 'Categoría:' +" "+ category);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 190, 'División:' +" "+ division);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(450, 190, 'Rama:' +" "+ branch);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 155, 'Campeonato:' +" "+ nameChampionship);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(450, 155, 'Gestión:' +" "+ todayYear);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(285, 225, 'RELACIÓN');
            doc.text(225, 255, 'NOMINAL DE JUGADORES');


            doc.setFontSize(10); //aumenta tamanio de la letra
            doc.rect(237, 270, 222, 15);
            doc.text(285, 280, 'Certificado de Nacimiento');
            doc.cellInitialize();

            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Nombre Completo"){
                        doc.cell(35,285,180,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Fecha Nac."){
                        doc.cell(35,285,60,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Club Origen"){
                        doc.cell(35,285,80,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Registro"){
                        doc.cell(35,285,50,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Certificado de Nacimiento"){
                        doc.cell(35,285,200,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="O.R.C"){
                        doc.cell(35,285,35,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Libro Nro"){
                        doc.cell(35,285,42,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Part."){
                        doc.cell(35,285,30,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="F. de Part."){
                        doc.cell(35,285,55,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else{
                        doc.cell(35,285,22,20,cell,i);
                        doc.setFillColor(221,221,221);
                    }
                });

            });
            //doc.save('Reporte Equipos Menores.pdf');
            doc.output("dataurlnewwindow");
        },

        generateReportTransfers: function(table, transfer){
            var imgData = imageConfig;
            var clubNameOrigin = transfer.originClub.name.toUpperCase();
            var clubNameDestiny = transfer.newClub.name.toUpperCase();
            var player = transfer.player;
            var division = transfer.division.toUpperCase();
            var lastname = player.lastname ? player.lastname: '';
            var secondlastname = player.secondlastname ?
                player.secondlastname : '';
            var playerFullName = lastname + ' ' + secondlastname + ', ' +
                player.name ;
            var place = player.cityOfBirth;
            var dateBirth = player.dateOfBirth;
            var today = new Date();
            var todayYear = today.getFullYear();

            var doc = new jsPDF({},'pt','legal',true);
            doc.addImage(imgData, 'JPEG', 35, 10, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(195, 53, 'ASOCIACIÓN DEPARTAMENTAL');
            doc.text(210, 78, 'DE VOLEIBOL COCHABAMBA');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 110, 'Formulario:03');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(185, 140, 'Certificado De Transferencia');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(35, 175, '1.- Club de Origen:' +' '+ clubNameOrigin);

            doc.setFont("helvetica");
            doc.setFontSize(11); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(58, 220, 'De conformidad con la reglamentación vigente ' +
                'de la Asociación Municipal de Voleibol');
            doc.text(58, 240, 'COCHABAMBA Certificamos que:');

            doc.setFont("helvetica");
            doc.setFontSize(12); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(220, 290,  playerFullName);
            doc.text(180, 310, 'Apellidos y Nombres completos del Jugador (a)');
            doc.text(240, 350,  place + ', '+ dateBirth);
            doc.text(230, 370, 'Lugar y Fecha de Nacimiento');

            doc.setFont("helvetica");
            doc.setFontSize(11); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(58, 420, 'Que hasta la fecha a formado parte del Club'
                +' '+ clubNameOrigin + ' ha cumplido');
            doc.text(58, 440, 'con sus obligaciones y NO tiene cargos ' +
                'pendientes con su Club, por cuyo efecto ');
            doc.text(58, 460, 'puede ser registrado en el Club ' +
                clubNameDestiny + ' en la división de '+ division);
            doc.text(58, 480, 'de la ' + 'gestión ' + todayYear);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(35, 520, '2.- Firmas y Sellos:');

            doc.setFont("helvetica");
            doc.setFontSize(12); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(65, 565, '...............................................');
            doc.text(70, 580, 'Presidente Club de Origen');
            doc.text(350, 565, '..............................................');
            doc.text(355, 580, 'Presidente Club Recepción');
            doc.text(230, 625, '.......................................');
            doc.text(255, 640, 'Jugador (a)');

            doc.setFontSize(12); //aumenta tamanio de la letra
            doc.rect(75, 800, 460, 85);
            doc.text(95, 815, 'OBSERVACIONES V B Y APROBACION COMISIÓN');
            doc.text(95, 835, 'DE ORGANIZACIÓN DEPORTIVA:');
            doc.cellInitialize();

            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Fechas de Registro"){
                        doc.cell(75,680,280,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Dia"){
                        doc.cell(75,680,60,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Mes"){
                        doc.cell(75,680,60,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Gestion"){
                        doc.cell(75,680,60,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else{
                        doc.cell(75,680,22,20,cell,i);
                        doc.setFillColor(221,221,221);
                    }
                });

            });
            //doc.save('Reporte Equipos Menores.pdf');
            doc.output("dataurlnewwindow");
        }
    };
}]);