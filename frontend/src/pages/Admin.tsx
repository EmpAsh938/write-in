import { useEffect, useState } from "react";

const Admin = () => {
    const [tabName, setTabName] = useState<string>("users");

    useEffect(() => {
     document.querySelectorAll<HTMLElement>('.admin-tab').forEach(tab => tab.style.display = "none");
     let activeTab = document.getElementById(tabName);
     if(activeTab) activeTab.style.display = "flex";
    }, [tabName])
    return (
        <main className="max-w-xl w-full mx-auto p-2 flex gap-4 items-center justify-start">
            <aside className="px-10 flex flex-col gap-4 border-2 border-solid border-gray-500">
                <button onClick={()=>setTabName('users')}>Users</button>
                <button onClick={()=>setTabName('posts')}>Posts</button>
            </aside>
            <section>
                <div id="users" className="admin-tab flex-col gap-4">
                    <div>
                        <h2>User List</h2>
                    </div>
                    <table>
                        <thead>
                            <tr className="flex items-center gap-2">
                                <th className="flex-1">_id</th>
                                <th className="flex-1">fullname</th>
                                <th className="flex-1">username</th>
                                <th className="flex-1">profile picture</th>
                                <th className="flex-1">followers</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-sm font-normal flex items-center gap-2">
                                <td className="flex-1">asdfasdf</td>
                                <td className="flex-1">john carol</td>
                                <td className="flex-1">john123</td>
                                <td className="flex-1"></td>
                                <td className="flex-1">200</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="posts" className="admin-tab">posts</div>
            </section>
        </main>
    )
}

export default Admin;
