#
# Copyright 2020 XEBIALABS
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#

namePattern = request.query["namePattern"]

# Get the list of ci (com.xebialabs.deployit.plugin.api.udm.ConfigurationItem)
deployedApp_ids = repositoryService.query(Type.valueOf("udm.DeployedApplication"), None, "Environments", namePattern, None, None, 0, -1)

# Get the list of details for each ci
ids = [loop.id for loop in deployedApp_ids]

# Get the list of deployedApplication (com.xebialabs.deployit.plugin.api.udm.deployedApplication)
deployedApp = repositoryService.read(ids)
result = []
for dApp in deployedApp:
    app_id = dApp.id
    temp = {}
    temp["id"] = app_id
    temp["version"] = dApp.version.id
    env_id = app_id[0:app_id.rfind('/')]
    env = repositoryService.read(env_id)
    temp["category"] = env.matrixcategory.id if env.matrixcategory != None else ''
    result.append(temp)
    
response.entity = result