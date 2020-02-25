#
# Copyright 2020 XEBIALABS
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#

name = request.entity["name"]
apps = request.entity["apps"]

if name:
    if apps:

        name = "Configuration/" + name
        exists = repositoryService.exists(name)

        if exists:
            ci = repositoryService.read(name)
        else:
            ci = Type.valueOf("matrix.applicationSet").getDescriptor().newInstance(name)

        list_of_apps = []
        for app in apps:
            list_of_apps.append(Type.valueOf("udm.Application").getDescriptor().newInstance(app))
        ci.setProperty("applications", list_of_apps)

        if exists:
            result = repositoryService.update(name, ci)
        else:
            result = repositoryService.create(name, ci)

        response.entity = result