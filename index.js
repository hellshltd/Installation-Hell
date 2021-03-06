var packages=[];
document.addEventListener("DOMContentLoaded",function()
{
	var hash=location.hash.toString().replace("#","");
	if(hash=="")
	{
		$(":checked").each(function()
		{
			addPackage(this.id);
		});
	}
	else
	{
		var packages_=hash.split(",");
		$(":checked").prop("checked",false);
		$(packages_).each(function()
		{
			var arr=this.split(":"),
			package=arr[0];
			packages.push(package);
			$("#"+package).prop("checked",true);
			if(this.length>(package.length+1))
			{
				$("#input-"+package).val(decodeURIComponent(this.substr(package.length+1)));
			}
		});
	}
	updatePackages();
	$("[type='checkbox']").change(function()
	{
		if(this.checked)
		{
			addPackage(this.id);
			if($(this).attr("data-parent"))
			{
				var parent=$("#"+$(this).attr("data-parent"));
				if(!parent.is(":checked"))
				{
					parent.prop("checked",true).change();
				}
			}
			if($(this).attr("data-requirement"))
			{
				var requirement=$("#"+$(this).attr("data-requirement"));
				if(!requirement.is(":checked"))
				{
					requirement.prop("checked",true).change();
				}
			}
		}
		else
		{
			removePackage(this.id);
			$("[data-parent='"+this.id+"']:checked").prop("checked",false).change();
			$("[data-requirement='"+this.id+"']:checked").prop("checked",false).change();
		}
		packages.sort();
		updatePackages();
	});
	$("input[type='text']").on("input",updatePackages);
});
function addPackage(id)
{
	if($.inArray(id, packages) == -1)
	{
		packages.push(id);
	}
}
function removePackage(id)
{
	if($.inArray(id, packages) > -1)
	{
		packages.splice($.inArray(id, packages), 1);
	}
}
function updatePackages()
{
	if(packages.length==0)
	{
		$("#wget-cmd").val("# Installus Nothingus");
		$("#curl-cmd").val("");
		history.pushState($("title").html(),{},"#");
	}
	else
	{
		var values = "", values_unset = "", hash = "", uri = "";
		$(packages).each(function()
		{
			uri += this;
			hash += this;
			if($("#input-"+this).length>0)
			{
				values += "export " + this.toUpperCase().split("-").join("_") + "=\"" + $("#input-"+this).val().split("\"").join("\\\"") + "\" && ";
				values_unset += " && unset " + this.toUpperCase().split("-").join("_");
				hash += ":" + encodeURIComponent($("#input-"+this).val());
			}
			uri += ",";
			hash += ",";
		});
		uri = uri.substr(0, uri.length - 1);
		hash = hash.substr(0, hash.length - 1);
		history.pushState($("title").html(),{},"#"+hash);
		$("#wget-cmd").val(values + "wget -qO- https://installation.hell.sh/"+uri+" | bash" + values_unset);
		$("#curl-cmd").val(values + "curl -sSL https://installation.hell.sh/"+uri+" | bash" + values_unset);
	}
}
