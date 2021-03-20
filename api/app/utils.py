from functools import wraps, partial
import typing
import inspect


def _ify(func, factory=list):
    if inspect.isasyncgenfunction(func):
        @wraps(func)
        async def new_func(*args, **kwargs):
            return factory([x async for x in func(*args, **kwargs)])
    else:
        @wraps(func)
        def new_func(*args, **kwargs):
            return factory(func(*args, **kwargs))
    return new_func


listify = partial(_ify, factory=list)
dictify = partial(_ify, factory=dict)
